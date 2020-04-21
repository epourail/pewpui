<?php

declare(strict_types=1);

namespace App\Controller;

use App\Manager\ConsoleManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class PewPewController
 * @package App\Controller
 */
final class PewPewController extends AbstractController
{
    /** @var ConsoleManagerInterface $consoleManager */
    private $consoleManager;

    /**
     * PewPewController constructor.
     * @param ConsoleManagerInterface $consoleManager
     */
    public function __construct(ConsoleManagerInterface $consoleManager)
    {
        $this->consoleManager = $consoleManager;
    }

    /**
     * @Route("/pewpew", name="app_pewpew_get_collection")
     */
    public function getCollection(): Response
    {
        return new Response(
            $this->consoleManager->crontab(),
            Response::HTTP_OK,
            ['Content-Type' => 'text/plain']
        );
    }
}
