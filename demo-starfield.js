

var letters = "I want to go to another planet ...".toUpperCase().split("");
var gapInner = 25;
var gapOuter = 35;
var radius = 280;
var diagonal = 0;
var smallRadius = radius-gapInner;
var smallDiameter = radius*2-gapInner;
var bigDiameter = radius*2+gapOuter;
var mid = 320;
var midHalf = 180;
var start = 0;
var stars = [];
var speed;
var starNr = 800;

function setup() {
	diagonal = Math.floor(sqrt(370*370+370*370))*2;
   var cnv = createCanvas(640, 640);
    cnv.parent('canvasZone');
	mid = 320;
	radius = 280;
	frameRate(50);
	speed =5;
	
	for (var i = 0; i < starNr; i++) {
		stars.push(new Star());
	  }
	
	 cnv.mouseWheel(function(e){
	 if (e.deltaY > 0) {
	   speed += 1;
	  } else {
		speed-= 1;
	  }
	  if(speed <0) speed =0;
	  if(speed >20) speed=20;
	  $("#speed").val(speed);
	  $("#speedInfo").text(speed);
  });
  
  $("#speed").on("change",function(){
	  
	  speed =   $("#speed").val();
	   $("#speedInfo").text(speed);
  });
  
}


function draw() {
	translate(0, 0);
	background(150);
	
	
	noFill();





	for(var i=bigDiameter;i<diagonal;i++){
		var c =  map(i, bigDiameter, diagonal, 0, 90);
		c = 90-c;
		var r = 122 - c;
		var g = 70 - c;
		var b = 18 - c;
		
		if(g<0) g=0;
		if(b<0) b=0;
		stroke(r,g,b);
		ellipse(mid, mid, i, i);
	}
	

	stroke(255);
	fill(122,70,18);

	
	ellipse(mid, mid, bigDiameter, bigDiameter);
	fill(0);
	
	ellipse(mid, mid, smallDiameter, smallDiameter);
	
	noFill();
	
	if(speed==0){
		start = 0;
	}
	else if(speed <5){
		start = (PI+frameCount/140)%(2*PI) / 5;
	}else{
		start = (PI+frameCount/140)%(2*PI) * (speed/5);
	}


	
	
	letters.forEach(function(letter){
		if(letter==" "){
			start+=0.25;
		}else{
			start+=0.15;
		}

		var x = (cos(start)*radius) + mid;
		var y = (sin(start)*radius) + mid;

		push();
		translate(x, y);
		rotate(start+HALF_PI);
		text(letter, 0, 0);
		start = start % (PI*2);
		fill(255); 
		pop();
	}); 

	
	translate(width / 2, height / 2);
	
	var north = {x:0,y:-50};
	var east = {x:50,y:0};
	var south = {x:0,y:50};
	var west = {x:-50,y:0};
	
	push();
	rotate(start);
	var c = color('rgba(255, 255, 255, 0.1)');
	fill(c);
	ellipse(0, 0, 100, 100);
	line(north.x,north.y,south.x,south.y);
	line(west.x,west.y,east.x,east.y);

	pop();

	if(speed==0){
		start = 0;
	}
	else if(speed <5){
		start = 0.01;
	}else
		start = 0.05 / speed;
	
	//start = 0;
	 for (var i = 0; i < stars.length; i++) {
		stars[i].update();
		stars[i].show(start);
	  }
	  
}

function Star() {
this.x=random(-radius, radius);
  this.y = random(-radius, radius);
  this.z = random(radius);
  this.pz = this.z;

  this.update = function(offset) {
    this.z = this.z - speed;
    if (this.z < 1) {
      this.z = radius;

	  this.x=random(-radius, radius);

      this.y = random(-radius, radius);

      this.pz = this.z;
    }

  }

  this.show = function(rot) {
	  rotate(rot);
    fill(255);
    noStroke();

    var sx = map(this.x / this.z, 0, 1, 0, radius);
    var sy = map(this.y / this.z, 0, 1, 0, radius);
	
	var dist = sqrt(sx*sx + sy*sy);
if(dist <= smallRadius){
    var r = map(this.z, 0, radius,10, 0);
	
	if(speed<=12){
		ellipse(sx, sy, r, r);
	}
 

    var px = map(this.x / this.pz, 0, 1, 0, radius);
    var py = map(this.y / this.pz, 0, 1, 0, radius);


    this.pz = this.z;

    stroke(255);
	if(speed<=12){
		 strokeWeight(1);
	}else{
		 strokeWeight(2);
	}
  

	line(px, py, sx, sy);
}

  }
}


function simpleRotate(point,angle){
	var cos = Math.cos(angle);
	var sin = -Math.sin(angle);
	rotatedX = point.x * cos - point.y * sin;
    rotatedY = point.y * cos + point.x * sin;
	return {"x":rotatedX,"y":rotatedY}
}
