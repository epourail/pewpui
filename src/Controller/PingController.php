<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class PingController
 * @package App\Controller
 */
final class PingController extends AbstractController
{
    /**
     * @Route("/ping", name="app_ping")
     */
    public function ping(): Response
    {
        return new Response(
            'pong',
            Response::HTTP_OK,
            ['Content-Type' => 'text/plain']
        );
    }
}
