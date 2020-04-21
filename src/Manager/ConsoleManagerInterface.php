<?php

declare(strict_types=1);

namespace App\Manager;

use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;
use Symfony\Component\Process\Process;

/**
 * Class ConsoleManagerInterface
 * @package App\Manager
 */
interface ConsoleManagerInterface
{
    /**
     * @return string|null
     */
    public function getLastOutputText(): ?string;

    /**  */
    public function crontab(): string;
}
