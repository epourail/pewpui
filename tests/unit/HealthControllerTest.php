<?php namespace App\Tests;

use App\Controller\HealthController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class HealthControllerTest
 * @package App\Tests
 */
class HealthControllerTest extends \Codeception\Test\Unit
{
    /**
     * @var \App\Tests\UnitTester
     */
    protected $tester;

    // tests
    public function testHealth()
    {
        $controller = new HealthController();

        $response =  $controller->health();

        $this->assertEquals(
            Response::HTTP_OK,
            $response->getStatusCode()
        );
        $this->assertEquals(
            'healthy',
            $response->getContent()
        );
        $this->assertEquals(
            'text/plain',
            $response->headers->get('Content-Type')
        );
    }
}
