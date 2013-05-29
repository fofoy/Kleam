<?php
class App_controller{

    private $basket;

    function __construct(){
        $this->basket=new \Basket;
        $count=$this->basket->count();
        F3::set('count',$count);
    }
 
    function home(){
        echo Views::instance()->render('index.html');
    }

    function __destruct(){

    }

}
?>