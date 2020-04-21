<?php

declare(strict_types=1);

namespace App\Manager;

use Psr\Log\LoggerInterface;
use Symfony\Component\Process\Process;

/**
 * Class ConsoleManager
 * @package App\Manager
 */
final class ConsoleManager implements ConsoleManagerInterface
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var string
     */
    private $projectDirectory;

    /**
     * @var string
     */
    private $lastOutputText;

    /**
     * @param LoggerInterface $logger
     * @param string          $projectDirectory
     */
    public function __construct(LoggerInterface $logger, string $projectDirectory)
    {
        $this->logger = $logger;
        $this->projectDirectory = $projectDirectory;
    }

    /**
     * @return string|null
     */
    public function getLastOutputText(): ?string
    {
        return $this->lastOutputText;
    }

    public function crontab(): string
    {
        return $this
            ->run('crontab -l')
            ->getOutput();
    }

    /**
     * @param string $command
     * @return Process
     */
    private function run(string $command): Process
    {
        $this->setLastOutputText();

        $process = Process::fromShellCommandline(
            $command,
            $this->projectDirectory,
            null,
            null,
            600.0
        );
        $process->setIdleTimeout(null);
        $process->setTimeout(null);
        $process->run();

        $this->setLastOutputText($process->getOutput());

        $this->logger->info(
            'Run command',
            [
                'command' => $command,
                'stderr' => $process->getErrorOutput(),
                'stdout' => $process->getOutput()
            ]
        );

        return $process;
    }

    /**
     * @param string|null $text
     */
    private function setLastOutputText(?string $text = null): void
    {
        $this->lastOutputText = $text;
    }
}
