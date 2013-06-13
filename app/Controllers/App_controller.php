<?php
class App_controller{

    public $openid_infos;

    function __construct(){

    }
 
    function home(){
        switch(F3::get('VERB')){
            case 'GET':
                if(F3::get('SESSION.id')){
                    F3::reroute('/dashboard');
                } else {
                    echo Views::instance()->render('index.html');
                }
            break;
            case 'POST':
            break;
        }
    }

    function login(){
        require('app/Helpers/Library/openid.php');
        $openid = new LightOpenID('localhost');
        $openid->identity = 'http://steamcommunity.com/openid/';
        header('Location: ' . $openid->authUrl());
        if ($openid->mode) {
            if($openid->validate()){
                echo $openid->validate() ? 'Logged in.' : 'Failed';
                $lol = $openid->getAttributes();
                //F3::set('SESSION.openid',$openid);
                F3::set('SESSION.lolo',$lol);
                F3::reroute('/dashboard');
            }
            echo $openid->validate() ? 'Logged in.' : 'Failed';
        }
    }
    function test(){
        echo Views::instance()->render('test_d3.html');
    }

    function done(){
        $openid=new OpenID;
        echo $openid->verified()?'Success':'Failure';
    }

    function dashboard(){
        require('app/Helpers/Library/steam-condenser.php');
        $id = SteamId::create('76561197966166493');
        $stats = $id->getGames();
        //$achievements = $stats->getAchievements();
        F3::set('id',F3::get('SESSION.id'));
        F3::set('lol',$stats);
        F3::set('count',count($stats));
        F3::set('json',json_encode($stats));
        echo Views::instance()->render('dashboard.html');
    }

    function __destruct(){

    }

}
?>