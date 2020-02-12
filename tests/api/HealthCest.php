<?php namespace App\Tests;

use Codeception\Util\HttpCode;

/**
 * Class HealthCest
 * @package App\Tests
 */
class HealthCest
{
    // tests
    public function health(ApiTester $I)
    {
        $I->wantTo('test the health route');

        $I->sendGET('/health');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeHttpHeaderOnce('Content-Type', 'text/plain');
        $I->seeResponseEquals('healthy');
    }
}
