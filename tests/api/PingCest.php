<?php namespace App\Tests;

use Codeception\Util\HttpCode;

/**
 * Class PingCest
 * @package App\Tests
 */
class PingCest
{
    // tests
    public function ping(ApiTester $I)
    {
        $I->wantTo('test the ping route');

        $I->sendGET('/ping');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeHttpHeaderOnce('Content-Type', 'text/plain');
        $I->seeResponseEquals('pong');
    }
}
