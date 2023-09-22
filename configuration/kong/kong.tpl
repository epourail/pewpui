_format_version: "3.0"

services:
- name: directus-service
  url: http://directus:8055
  routes:
  - name: directus-route
    hosts:
    - '##PUBLIC_HOST##'
    paths:
    - '/cms'
    strip_path: true

- name: keycloak-service
  url: http://keycloak:8080
  routes:
  - name: keycloak-route
    paths:
    - '/auth'
    strip_path: true
    hosts:
    - '##PUBLIC_HOST##'

- name: adminer-service
  url: http://adminer:8080
  routes:
  - name: adminer-route
    paths:
    - '/adminer'
    strip_path: true
    preserve_host: true
    hosts:
    - '##PUBLIC_HOST##'

- name: api-places-service
  url: http://places-api:80
  routes:
  - name: api-places-route
    paths:
    - '/api'
    strip_path: true
    preserve_host: true
    hosts:
    - '##PUBLIC_HOST##'

# plugins:
# - name: cors
#   config:
#     origins:
#     - '*'
# - name: response-transformer
#   config:
#     add:
#       headers:
#       - "Content-Security-Policy: default-src 'self' https:; script-src https://cdn.ckeditor.com https://www.youtube.com https://*.dmcdn.net https://*.dailymotion.com https://player.vimeo.com 'self' 'unsafe-inline' 'unsafe-eval'; style-src * 'self' data: 'unsafe-inline'; img-src * 'self' data: blob:; font-src * 'self' data:; connect-src https://*.api.here.com https://*.hereapi.com https://vimeo.com 'self'; frame-src https://www.youtube.com https://www.dailymotion.com https://player.vimeo.com 'self' ; worker-src 'self'; frame-ancestors 'self'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content; reflected-xss block; manifest-src 'self'"
#       - "Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(self), geolocation=(self), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), notifications=(self), payment=(), picture-in-picture=(), publickey-credentials-get=(), push=(self), speaker=(self), sync-xhr=(), usb=(), vibrate=(self), web-share=(), xr-spatial-tracking=()"
#       - "Upgrade-Insecure-Requests:1"
#       - "X-Frame-Options:DENY"
#       - "X-XSS-Protection:1"
#       - "X-Content-Type-Options:nosniff"
#       - "Referrer-Policy:no-referrer-when-downgrade"
#       - "Strict-Transport-Security: max-age=15768000 ; includeSubDomains"
    