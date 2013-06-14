$(function(){

$('body > section').css('min-height',$(window).height());
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
function podium(){
    if ($(window).scrollTop() > hScoreboard - 200) {
        $('section.scoreboard > div > div:first-child > div').height(70);
        $('section.scoreboard > div > div:nth-child(2) > div').height(110);
        $('section.scoreboard > div > div:last-child > div').height(50);
    }
}
$(window).scroll(podium);

var W = window.innerWidth, H = window.innerHeight;
mx = W/2;
my = H/2;

function mapGames(data,biggestPlayed){
	var circle = [];
	var i=0;
	var scene = new Kinetic.Stage({
	    container: "map",
	    width: W,
	    height: H
	  });

	var calque = new Kinetic.Layer();
	$.each( data.games, function( key, value ) {
		if (value.playedTime > 60){
			var r = (value.playedTime/biggestPlayed)*150;
			if (r<10){r=10;}
			circle.push(
		    		new Kinetic.Circle({
				    	radius: r,
				        fill: "red",
				        stroke: 'black',
				        strokeWidth: 4,
				      	x: (Math.random()*(W/2))+(W/4),
				      	y: (Math.random()*(H/2))+(H/4)
				   })
		    	);
		    
		    calque.add(circle[i]);
		    i++;
		   }
	});

	scene.add(calque);
}


/* DATA */
$.getJSON('public/player.json', function(data) {
	var totalGames=0;
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
	});

	mapGames(data,biggestPlayed);

	month = Math.floor(playedTimeTotal/43200);
	playedTimeTotal = playedTimeTotal - (month*43200);
	day = Math.floor(playedTimeTotal/1440);
	playedTimeTotal = playedTimeTotal - (day*1440);
	hour = Math.floor(playedTimeTotal/60);

    $('.dashboard > section > section > h2').text("Hi, "+data.infos.nickname);
    $('.dashboard > section > section > img').attr("src", data.infos.avatar);
    $('.dashboard > section > section > span').html("You have played a total of "+month+" month(s), "+day+" day(s) and "+hour+" hour(s). <br>Guess what? That’s the time it takes to build a house.")
    $('.dashboard > section > section > ul > li:nth-child(2)').html(totalGames+"<p>Owned games</p>");
    $('.dashboard > section > section > ul > li:nth-child(3)').html(playedGames+"<p>Played games</p>");
    $('.dashboard > section > section > ul > li:nth-child(5)').html(totalAchievements+"<p>Achievements</p>");
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
        .value(function(d) { return d.hours; })
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
