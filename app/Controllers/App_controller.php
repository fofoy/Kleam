<?php
class App_controller{

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
                F3::set('infos',$openid);
                F3::reroute('/dashboard');
            }
            echo $openid->validate() ? 'Logged in.' : 'Failed';
        }
    }

    function done(){
        $openid=new OpenID;
        echo $openid->verified()?'Success':'Failure';
    }

    function dashboard(){
        //require('app/Helpers/Library/steam-condenser.php');
        echo Views::instance()->render('dashboard.html');
    }

    function __destruct(){

    }

}
?>