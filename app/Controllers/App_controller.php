<?php
class App_controller{

    public $openid_infos;
    public $profile;

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
                //$ajax['pictures']=array_map(function($item){return array('image'=>$item->src);},$pictures);
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
    function map(){
        echo Views::instance()->render('map.html');
    }

    function done(){
        $openid=new OpenID;
        echo $openid->verified()?'Success':'Failure';
    }

    function dashboard(){
        require('app/Helpers/Library/steam-condenser.php');
        $steamId = SteamId::create('76561197964139068');
        $gamesArray = $steamId->getGames();
        $friendsArray = $steamId->getFriends();
        F3::set('id',F3::get('SESSION.id'));
        $ajax['infos']['nickname']=$steamId->getNickname();
        $ajax['infos']['avatar']=stripslashes($steamId->getFullAvatarUrl());
        $ajax['games']=array_map(function($item){
            $steamId = SteamId::create('76561197964139068');
            if($item->shortName=='alienswarm'||$item->shortName=='defensegrid:awakening'||$item->shortName=='l4d'||$item->shortName=='l4d2'||$item->shortName=='portal2'||$item->shortName=='tf2'){
                return array(
                    'appId'=>$item->appId,
                    'gameName'=>$item->name,
                    'shortName'=>$item->shortName,
                    'playedTime'=>$steamId->getTotalPlaytime($item->appId),
                    'achievements'=>$steamId->getGameStats($item->shortName)->getAchievementsDone()
                );
            }else{
                return array(
                    'appId'=>$item->appId,
                    'gameName'=>$item->name,
                    'shortName'=>$item->shortName,
                    'playedTime'=>$steamId->getTotalPlaytime($item->appId),
                    'achievements'=>0
                );
            }
        },$gamesArray);
        //$ajax['games']=array_map("array_pop",$ajax['games']);
        /*$ajax['friends']=array_map(function($item){
            $steamId = SteamId::create($item->steamId64);
            return array(
                'infos'=>array(
                    'steamId'=>$item->steamId64,
                    'nickname'=>$steamId->getNickName(),
                    'avatar'=>$steamId->getIconAvatarUrl()
                )
            );
        },$friendsArray);*/
        /*$ajax['friends']=array_map(function($item1){
            $steamId=SteamId::create($item1->steamId64);
            return array(
                'steamId'=>$steamId,
                'nickname'=>$steamId->getNickName(),
                //'avatar'=>stripslashes($steamId->getFullAvatarUrl())
                $ajax['friends']['games']=array_map(function($item2){
                    $steamId=SteamId::create($item1->steamId64);
                    return array(
                        'appId'=>$item2->appId,
                        'gameName'=>$item2->name,
                        'shortName'=>$item2->shortName,
                        'playedTime'=>$steamId->getTotalPlaytime($item2->appId),
                        'achievements'=>0
                    );
                },$steamId);
        )},$friendsArray);*/
        $json = json_encode($ajax);

        $fp = fopen('results.json', 'w');
        fwrite($fp, json_encode($ajax));
        fclose($fp);

        F3::set('json',$json);
        echo Views::instance()->render('dashboard.html');
    }

    function __destruct(){

    }

}
?>