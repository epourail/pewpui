<?php use App\Tests\AcceptanceTester;

$I = new AcceptanceTester($scenario);
$I->wantTo('perform actions and see result');
$I->sendGET('/ping');
$I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
