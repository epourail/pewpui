<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class HealthController
 * @package App\Controller
 */
final class HealthController extends AbstractController
{
    /**
     * @Route("/health", name="app_health")
     */
    public function health(): Response
    {
        return new Response(
            'healthy',
            Response::HTTP_OK,
            ['Content-Type' => 'text/plain']
        );
    }
}
