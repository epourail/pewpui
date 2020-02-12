<?php namespace App\Tests;

use App\Controller\PingController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class PingControllerTest
 * @package App\Tests
 */
class PingControllerTest extends \Codeception\Test\Unit
{
    /**
     * @var \App\Tests\UnitTester
     */
    protected $tester;

    // tests
    public function testPing()
    {
        $controller = new PingController();

        $response =  $controller->ping();

        $this->assertEquals(
            Response::HTTP_OK,
            $response->getStatusCode()
        );
        $this->assertEquals(
            'pong',
            $response->getContent()
        );
        $this->assertEquals(
            'text/plain',
            $response->headers->get('Content-Type')
        );
    }
}
