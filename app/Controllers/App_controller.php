<?php
class App_controller{

    private $basket;

    function __construct(){
        $this->basket=new \Basket;
        $count=$this->basket->count();
        F3::set('count',$count);
    }
 
    function home(){
        switch(F3::get('VERB')){
            case 'GET':
                if(F3::get('SESSION.userId')){
                    F3::reroute('/dashboard');
                } else {
                    echo Views::instance()->render('index.html');
                }
            break;
            case 'POST':
                require('app/Helpers/Library/openid.php');
                # Change 'localhost' to your domain name.
                $openid = new LightOpenID('localhost');
                if(!$openid->mode) {
                    $openid->identity = 'http://steamcommunity.com/openid/';
                    header('Location: ' . $openid->authUrl());
                } elseif($openid->mode == 'cancel') {
                    echo 'User has canceled authentication!';
                } else {
                    echo 'User ' . ($openid->validate() ? $openid->identity . ' has ' : 'has not ') . 'logged in.';
                    F3::set('SESSION.userId',$openid->identity);
                    F3::reroute('/dashboard');
                }
            break;
        }
    }

    function dashboard(){
        if(F3::get('SESSION.userId')){
            echo F3::get('SESSION.userId');
            echo Views::instance()->render('dashboard.html');
        } else {
            F3::reroute('/');
        }
    }
    function test(){
        echo Views::instance()->render('test_d3.html');
    }

    function __destruct(){

    }

}
?>