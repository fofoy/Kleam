$(function(){

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     ||  
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var W = window.innerWidth, H = window.innerHeight;
canvas.width = W;
canvas.height = H;

var max = 100;
var cubes = [];

function clear(){
	ctx.fillStyle = "rgba(0,0,0,0.1)";
  	ctx.fillRect (0, 0, W, H);
}

canvas.onmousemove = function(e){
    midPointX = e.pageX;
    midPointY = e.pageY;
}
canvas.onclick = function (){
	changeDirection();
}

function createCube(){
	this.x = Math.random() * W;
	this.y = Math.random() * H;
	this.vx = -1 + (Math.random()*2);
	this.vy = -1 + (Math.random()*2);
	this.w = Math.random() * 10;
	this.h = Math.random() * 10;

	this.draw = function() {
		ctx.fillStyle = "rgb(200,0,0)";
  		ctx.beginPath();
  		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
  		ctx.fill();
	}
}

function changeDirection(){
	for (var i = 0; i < cubes.length; i++) {
		c = cubes[i];
		c.vx= -1 + (Math.random()*2);
		c.yy= -1 + (Math.random()*2);
	};
}

for (var i = 0; i < max; i++) {
	cubes.push(new createCube());
};

function draw(){
	clear();
	for (var i = 0; i < cubes.length; i++) {
		c = cubes[i];

		c.x+= c.vx;
		c.y+=  c.vy;


		c.draw();
	};
}

function anim(){
	draw();
	requestAnimFrame(anim);
}

anim();

});