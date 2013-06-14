$(function(){

$('body > section').css('min-height',window.innerHeight);
$('section.scoreboard > div > div > div').height(0);
$('.player_details').hide();

/* Fixed list players */
var hPlayers = $('#players').offset().top;
function fixDiv() {
    var $cache = $('#players'); 
    if ($(window).scrollTop() > hPlayers) 
        $cache.css({'position': 'fixed', 'top': '0'}); 
    else
        $cache.css({'position': 'absolute', 'top': '0'});
    }
$(window).scroll(fixDiv);
fixDiv();

/* Effect on podium */
var hScoreboard = $('section.scoreboard').offset().top;

var W = window.innerWidth, H = window.innerHeight;
mx = W/2;
my = H/2;
function getRandomColor() {
        return "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",0.7)";
      }
function mapGames(data,biggestPlayed){
	
	var circleGames = [];
	var i=0;
	var sceneGames = new Kinetic.Stage({
	    container: "map_games",
	    width: W,
	    height: H
	  });

	var calqueGames = new Kinetic.Layer();
	$.each( data.games, function( key, value ) {
		if (value.playedTime > 60){
			var r = (value.playedTime/biggestPlayed)*150;
			if (r<10){r=10;}
			circleGames.push(
		    		new Kinetic.Circle({
				    	radius: r,
				        fill: getRandomColor(),
				        stroke: 'white',
				        strokeWidth: 4,
				        draggable: true,
				        name: value.gameName,
				      	x: (Math.random()*(W/1.5))+(W/6),
				      	y: (Math.random()*(H/2))+(H/3)
				   })
		    	);
		    circleGames[i].on('mouseover',function(){
		    	$('.dashboard > section#games > h3').text(this.getName());
		    });
		     circleGames[i].on('mouseout',function(){
		    	$('.dashboard > section#games > h3').text("");
		    });
		    calqueGames.add(circleGames[i]);
		    i++;
		   }
	});
	sceneGames.add(calqueGames);
}

function mapFriends(data,biggestScore,playerScore){
	var circleFriends = [];
	var i=0;
	var sceneFriends = new Kinetic.Stage({
	    container: "map_friends",
	    width: W,
	    height: H
	  });

	var calqueFriends = new Kinetic.Layer();

	$.each( data.friends, function( key, value ) {
    	var score = 0;
		$.each( value.games, function( key, value ) {
			score += 5;
			if (value.playedTime>60) {score += 10;}
			score += (value.playedTime/60)*2;
			score += value.achievements*10;
		});
		score = Math.round(score);

		
		var r = (score/biggestScore)*100;
		if (r<6){r=6;}

		var imageObj = new Image();
		imageObj.src = value.infos.avatar;
		imageObj.onload = function() {
	        circleFriends.push(
		  		new Kinetic.Circle({
			    	radius: r,
			        fillPatternImage: imageObj,
			        fillPatternOffset: [-280, 90],
			        stroke: 'black',
			        strokeWidth: 4,
			        draggable: true,
			        name: value.infos.nickname,
			      	x: (Math.random()*(W/1.5))+(W/6),
			      	y: (Math.random()*(H/2))+(H/3)
			   })
		  	);
			circleFriends[i].on('mouseover',function(){
			  	$('.dashboard > section#friends > h3').text(this.getName());
			});
			circleFriends[i].on('mouseout',function(){
			  	$('.dashboard > section#friends > h3').text("");
			});
			calqueFriends.add(circleFriends[i]);
			i++;
			calqueFriends.draw();
	      };
	});
	
	var r = (playerScore/biggestScore)*100;

	var imageObjP = new Image();
		imageObjP.src = data.infos.avatar;
		imageObjP.onload = function() {
			playerCircle = new Kinetic.Circle({
					    	radius: r,
					        fillPatternImage: imageObjP,
			       			 fillPatternOffset: [-280, 90],
					        stroke: 'black',
					        strokeWidth: 4,
					        draggable: true,
					        name: data.infos.nickname,
					      	x: W/2,
					      	y: H/2
					   });
			playerCircle.on('mouseover',function(){
				$('.dashboard > section#friends > h3').text(this.getName());
			});
			playerCircle.on('mouseout',function(){
				$('.dashboard > section#friends > h3').text("");
			});
			calqueFriends.add(playerCircle);
			calqueFriends.draw();
		};
	sceneFriends.add(calqueFriends);
}

var classement = [];
/* DATA */
$.getJSON('public/player.json', function(data) {
	var playerScore =0;
	var biggestScore = 0;
	var totalGames=0;
	var totalFriends=0;
	var playedTimeTotal = 0;
	var playedGames = 0;
	var totalAchievements = 0;
	var biggestPlayed = 0;
	

	$.each( data.games, function( key, value ) {
		totalGames++;
		playedTimeTotal += value.playedTime;
		totalAchievements += value.achievements;
		if (value.playedTime > 60){
			playedGames++;
		}
		if (value.playedTime > biggestPlayed){
			biggestPlayed = value.playedTime;
		}

		playerScore += 5;
		if (value.playedTime>60) {playerScore += 10;}
		playerScore += (value.playedTime/60)*2;
		playerScore += value.achievements*10;
	});


	month = Math.floor(playedTimeTotal/43200);
	playedTimeTotal = playedTimeTotal - (month*43200);
	day = Math.floor(playedTimeTotal/1440);
	playedTimeTotal = playedTimeTotal - (day*1440);
	hour = Math.floor(playedTimeTotal/60);

	playerScore = Math.round(playerScore);

	data.played = playedTimeTotal;
	data.achievements = totalAchievements;
	data.score = playerScore;

	classement.push(data);
	
	if (playerScore > biggestScore){
			biggestScore = playerScore;
		}

    $.each( data.friends, function( key, value ) {
    	var tt = 0;
		var ta = 0;
    	var score = 0;
		totalFriends++;
		$.each( value.games, function( key, value ) {
			tt += value.playedTime;
			ta += value.achievements;
			score += 5;
			if (value.playedTime>60) {score += 10;}
			score += (value.playedTime/60)*2;
			score += value.achievements*10;
		});
		score = Math.round(score);
		if (score > biggestScore){
			biggestScore = score;
		}
		
		value.played = tt;
		value.achievements = ta;
		value.score = score;
		classement.push(value);
	});

	console.log(classement);

    $('.dashboard > section > section > h2').text("Hi, "+data.infos.nickname);
    $('.dashboard > section > section > img').attr("src", data.infos.avatar);
    $('.dashboard > section > section > span').html("You have played a total of "+month+" month(s), "+day+" day(s) and "+hour+" hour(s). <br>Guess what? That’s a lot.");
    $('.dashboard > section > section > ul > li:nth-child(1)').html(playerScore+"<p>Points</p>");
    $('.dashboard > section > section > ul > li:nth-child(2)').html(totalGames+"<p>Owned games</p>");
    $('.dashboard > section > section > ul > li:nth-child(3)').html(playedGames+"<p>Played games</p>");
    $('.dashboard > section > section > ul > li:nth-child(4)').html(totalFriends+"<p>Friends</p>");
    $('.dashboard > section > section > ul > li:nth-child(5)').html(totalAchievements+"<p>Achievements</p>");


    classement.push(data);
	classement.sort(function(a,b) { return parseFloat(b.score) - parseFloat(a.score) } );

	$('section.scoreboard > div > div:nth-child(2) > p:first-child').text(classement[0].score+" pts");
	$('section.scoreboard > div > div:nth-child(2) > img').attr("src", classement[0].infos.avatar);
	$('section.scoreboard > div > div:nth-child(2) > p:last-child').text(classement[0].infos.nickname);

	$('section.scoreboard > div > div:first-child > p:first-child').text(classement[1].score+" pts");
	$('section.scoreboard > div > div:first-child > img').attr("src", classement[1].infos.avatar);
	$('section.scoreboard > div > div:first-child > p:last-child').text(classement[1].infos.nickname);

	$('section.scoreboard > div > div:last-child > p:first-child').text(classement[2].score+" pts");
	$('section.scoreboard > div > div:last-child > img').attr("src", classement[2].infos.avatar);
	$('section.scoreboard > div > div:last-child > p:last-child').text(classement[2].infos.nickname);

    function podium(){
	    if ($(window).scrollTop() > hScoreboard - 200) {
	        $('section.scoreboard > div > div:first-child > div').height(70);
	        $('section.scoreboard > div > div:nth-child(2) > div').height(110);
	        $('section.scoreboard > div > div:last-child > div').height(50);
	    }
	}
	$(window).scroll(podium);

    mapGames(data,biggestPlayed);
    mapFriends(data,biggestScore,playerScore);


});






    
    /* code très sale ne pas regarder */
    var swidth = 200,
        sheight = 200,
        sradius = Math.min(swidth, sheight) / 2,
        mwidth = 400,
        mheight = 400,
        mradius = Math.min(mwidth, mheight) / 2,
        bwidth = 600,
        bheight = 600,
        bradius = Math.min(bwidth, bheight) / 2;

    var color = d3.scale.category10();

    var spie = d3.layout.pie()
        .value(function(d) { return d.achievements; })
        .sort(null);
    var mpie = d3.layout.pie()
        .value(function(d) { return d.games; })
        .sort(null);
    var bpie = d3.layout.pie()
        .value(function(d) { return d.hours;})
        .sort(null);

    var sarc = d3.svg.arc()
        .innerRadius(sradius - 40)
        .outerRadius(sradius - 0);
    var marc = d3.svg.arc()
        .innerRadius(mradius - 40)
        .outerRadius(mradius - 0);
    var barc = d3.svg.arc()
        .innerRadius(bradius - 40)
        .outerRadius(bradius - 0);


    var bsvg = d3.select("body>section.details").append("svg")
        .attr("width", bwidth)
        .attr("height", bheight)
        .attr("class", "big_pie")
      .append("g")
        .attr("transform", "translate(" + bwidth / 2 + "," + bheight / 2 + ")");
    var msvg = d3.select("body>section.details  ").append("svg")
        .attr("width", mwidth)
        .attr("height", mheight)
        .attr("class", "mid_pie")
      .append("g")
        .attr("transform", "translate(" + mwidth / 2 + "," + mheight / 2 + ")");
    var ssvg = d3.select("body>section.details").append("svg")
        .attr("width", swidth)
        .attr("height", sheight)
        .attr("class", "small_pie")
      .append("g")
        .attr("transform", "translate(" + swidth / 2 + "," + sheight / 2 + ")");

    d3.csv("http://localhost/kleam/public/data.tsv", function(error, data) {
      var bpath = bsvg.datum(data)
          .selectAll("path")
          .data(bpie)
          .enter().append("path")
          .attr("fill", function(d, i) { return color(i); })
          .attr("d", barc)
          .attr("class", function(d, i) { return "gamer_"+i }).on('mouseenter', function player_in(){
            var  curr = $(this).attr('class');
            $('.'+curr).css('opacity','0.5');
            $('.player_details').show();
          })
          .on('mouseleave', function player_out(){
            var  curr = $(this).attr('class');
            $('.'+curr).css('opacity','1');
            $('.player_details').hide();
          });
    });

    d3.csv("http://localhost/kleam/public/data.tsv", function(error, data) {
      var mpath = msvg.datum(data)
          .selectAll("path")
          .data(mpie)
          .enter().append("path")
          .attr("fill", function(d, i) { return color(i); })
          .attr("d", marc)
          .attr("class", function(d, i) { return "gamer_"+i })
          .on('mouseenter', function player_in(){
            var  curr = $(this).attr('class');
            $('.'+curr).css('opacity','0.5');
            $('.player_details').show();
          })
          .on('mouseleave', function player_out(){
            var  curr = $(this).attr('class');
            $('.'+curr).css('opacity','1');
            $('.player_details').hide();
          });
    });

    d3.csv("http://localhost/kleam/public/data.tsv", function(error, data) {
    	 console.log(data); 
      var spath = ssvg.datum(data)
          .selectAll("path")
          .data(spie)
          .enter().append("path")
          .attr("fill", function(d, i) { return color(i); })
          .attr("d", sarc)
          .attr("class", function(d, i) { return "gamer_"+i })
          .on('mouseenter', function player_in(){
            var  curr = $(this).attr('class');
            $('.'+curr).css('opacity','0.5');
            $('.player_details').show();
          })
          .on('mouseleave', function player_out(){
            var  curr = $(this).attr('class');
            $('.'+curr).css('opacity','1');
            $('.player_details').hide();
          });
    });

});
