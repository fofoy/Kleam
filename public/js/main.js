$(function(){

$('body > section').css('min-height',$(window).height());

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

    var hScoreboard = $('section.scoreboard').offset().top;
    function podium(){
        if ($(window).scrollTop() > hScoreboard - 200) {
            $('section.scoreboard > div > div:first-child > div').height(70);
            $('section.scoreboard > div > div:nth-child(2) > div').height(110);
            $('section.scoreboard > div > div:last-child > div').height(50);
        }
    }
    $(window).scroll(podium);

    $('section.scoreboard > div > div > div').height(0);
    $('.player_details').hide();

    $.getJSON('public/player.json', function(data) {
        $('section > section > h2').text("Hi, "+data.response.players[0].personaname);
        $('section > section > img').attr("src", data.response.players[0].avatarfull);
        $('section.scoreboard > div > div > img').attr("src", data.response.players[0].avatarfull);
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


var W = window.innerWidth, H = window.innerHeight;

mx = W/2;
my = H/2;
var cubes = [];

var scene = new Kinetic.Stage({
    container: "map",
    width: W,
    height: H
  });
 
var calque = new Kinetic.Layer();

for (var i = 0; i < 20; i++) {
    	cubes.push(
    		new Kinetic.Rect({
		      width: 100,
		      height: 60,
		      fill: "blue"
		   })
    	);
    	calque.add(cubes[i]);
    };
 
scene.add(calque);

});
