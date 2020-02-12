# ARGUMENTS FOR BUILD
ARG PHP_VERSION=7.3
ARG NGINX_VERSION=1.17

#
# "php" stage
#
FROM php:${PHP_VERSION}-fpm-alpine AS api_symfony_php

# persistent / runtime deps
RUN apk add --no-cache \
		acl \
		fcgi \
		file \
		gettext \
		git \
		procps \
	;

# Install php modules
ARG APCU_VERSION=5.1.18
RUN set -eux; \
	apk add --no-cache --virtual .build-deps \
		$PHPIZE_DEPS \
		icu-dev \
		libzip-dev \
		postgresql-dev \
		zlib-dev \
	; \
	\
	docker-php-ext-configure zip --with-libzip; \
	docker-php-ext-install -j$(nproc) \
		intl \
		pdo_pgsql \
		zip \
	; \
	pecl install \
		apcu-${APCU_VERSION} \
	; \
	pecl clear-cache; \
	docker-php-ext-enable \
		apcu \
		opcache \
	; \
	\
	runDeps="$( \
		scanelf --needed --nobanner --format '%n#p' --recursive /usr/local/lib/php/extensions \
			| tr ',' '\n' \
			| sort -u \
			| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
	)"; \
	apk add --no-cache --virtual .api-phpexts-rundeps $runDeps; \
	\
	apk del .build-deps

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install scripts and configurations useful to start/install the server
COPY docker/php/rootfs/usr /usr
RUN chmod +x /usr/local/bin/*

# Install PHP configurations (php.ini)
RUN ln -s $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini
RUN ln -s $PHP_INI_DIR/api-template.ini-production $PHP_INI_DIR/conf.d/api-template.ini
# Install PHP-FPM configuration (www.conf)
COPY docker/php/rootfs/usr/local/etc/php/php-fpm.d/www.conf /usr/local/etc/php-fpm.d/www.conf

RUN set -eux; \
	{ \
		echo '[www]'; \
		echo 'ping.path = /ping'; \
	} | tee /usr/local/etc/php-fpm.d/docker-healthcheck.conf

# Workaround to allow using PHPUnit 8 with Symfony 4.3
ENV SYMFONY_PHPUNIT_VERSION=8.3

# https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install Symfony Flex and Prestissimo globally to speed up download of Composer packages (parallelized prefetching)
RUN set -eux; \
	composer global require \
		"hirak/prestissimo:^0.3" \
		"symfony/flex" \
		--prefer-dist --no-progress --no-suggest --classmap-authoritative; \
	composer clear-cache
ENV PATH="${PATH}:/root/.composer/vendor/bin"

# Change directory to workdir
WORKDIR /srv/api

# Build for production
ARG ARG_APP_ENV=prod
ENV APP_ENV=$ARG_APP_ENV

# Prevent the reinstallation of vendors at every changes in the source code
COPY .env composer.json composer.lock symfony.lock ./
RUN set -eux; \
	composer install --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress --no-suggest; \
	composer clear-cache

# Copy only specifically what we need
COPY bin bin/
COPY config config/
COPY public public/
COPY src src/
COPY templates templates/
COPY translations translations/

# Run composer / clean cache and log
RUN set -eux; \
	mkdir -p var/cache var/log; \
	composer dump-autoload --classmap-authoritative --no-dev; \
	composer run-script --no-dev post-install-cmd; \
	chmod +x bin/console; sync

VOLUME /srv/api/var

COPY docker/php/docker-healthcheck.sh /usr/local/bin/docker-healthcheck
RUN chmod +x /usr/local/bin/docker-healthcheck

HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD ["docker-healthcheck"]

COPY docker/php/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
CMD ["serve"]


#
# "nginx" stage
#
FROM nginx:${NGINX_VERSION}-alpine AS api_symfony_nginx

RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

COPY docker/nginx/rootfs /

WORKDIR /srv/api/public

COPY --from=api_symfony_php /srv/api/public ./
