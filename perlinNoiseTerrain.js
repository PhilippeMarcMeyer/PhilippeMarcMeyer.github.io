// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/IKB1hWWedMk

// Edited by SacrificeProductions

var cols, rows;
var mainWidth = 640;
var mainHeight = 640;
var h2 = 320;
var w2 = 320;
var scl = 20;
var w = 1400;
var h = 1000;
var minValue = -100;
var terrainStrokeColor;
var terrain = [];
var camera;
var element;
var origin;
var focal = 256;
var moveBy = 10;
var rotStep = 0.1;
var relativeDistance = 0;
var relativeRotationY = 0;
var relativeRotationY_deg = 0;
var relativeAngle = 0;
var msgPtr1 = document.getElementById("msg1");
var msgPtr2 = document.getElementById("msg2");

function msg1(txt){
	msgPtr1.innerHTML = txt;
}
function msg2(txt){
	msgPtr2.innerHTML = txt;
}

function setup() {
  origin =  {
	  position : createVector(0,0,400),
	  rotation : createVector(0,HALF_PI,0)
  };
  camera = {
	  position : createVector(0,0,400),
	  rotation : createVector(0,HALF_PI,0),
	  display : function(){
		  push();
		    stroke(90);
			fill(color(255,255,255,40));
			ellipse(camera.position.x, camera.position.y, 40, 40);
			ellipse(camera.position.x, camera.position.y, 15, 15);
			line(-15,0,15,0);
			line(0,-15,0,15);
		  pop();
		  var deg = degrees(relativeRotationY)
		  msg1("Relative rotation : "+round(deg));
		  msg2("Relative distance : "+round(relativeDistance));  
	  },
	  	turn : function(amount){ // -1 or +1
			this.rotation.y -= rotStep*amount;
			relativeRotationY = (origin.rotation.y - this.rotation.y) % TWO_PI;
			relativeRotationY_deg = degrees(relativeRotationY);
		},
		  walk : function(amount){// -1 or +1
			var dirx = cos(this.rotation.y);
			var dirz = - sin(this.rotation.y);
			this.position.x = round(this.position.x + (dirx * amount * moveBy)); 
			this.position.z = round(this.position.z + (dirz * amount * moveBy));
			relativeDistance = origin.position.dist(this.position);
			
		}
  };
  element = {
	pos : createVector(mainWidth/3,mainHeight/2,-400),
	size : {w:70,h:120},
	color : color(90,120,240),
	rotX :   PI-0.15,
	rotY:   radians(15),
	display : function(){
		push();
		  var position = simpleRotate3d(this.pos,-relativeRotationY);
		  var scale = focal/(focal - position.z);
		  var X2d = (position.x) * scale;
		  var Y2d = (position.y-h2)* scale;
		  translate(X2d,Y2d);
		  rotateX(this.rotX);
		  rotateY(this.rotY);
		  ambientLight(50);
		  pointLight(255, 250, 250, 640, -600, 0);
		  ambientMaterial(this.color);
		  box(this.size.w*scale);
		pop();
	}
};
  frameRate(5);
  var cnv = createCanvas(640,640,WEBGL);
  cnv.parent('demoZone');
  cols = w / scl;
  rows = h/ scl;
  stroke(0,100,100);
  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0;
    }
  }
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, minValue, 100);
      xoff += 0.02;
    }
    yoff += 0.09;
  }
  terrainStrokeColor = color(0,0,0,90);
}

function draw() {

// orbitControl();
  background(180,200,220);
  push();
  translate(0, 50);
  rotateY(PI);
  rotateX(-PI/3);
  stroke(terrainStrokeColor);
  //fill(200,200,200, 50);
  translate(-w/2, -h/2);
  for (var y = 0; y < rows-1; y++) {
    beginShape(TRIANGLE_STRIP);

    for (var x = 0; x < cols; x++) {
		var currentElevation = terrain[x][y];
		var nextElevation = terrain[x][y+1];
		var r = 40;
		var g = (currentElevation*-1) - minValue;
		var b =  currentElevation - minValue;

		if(currentElevation < -70 ){
			r = g = b = 255;
		}	
		fill(r,g,b,199);

      vertex(x*scl, y*scl, currentElevation);
	 
      vertex(x*scl, (y+1)*scl, nextElevation);
    }
    endShape();
  }
  pop();
  
  element.display();
  camera.display();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
	 camera.walk(1);
  } else if (keyCode === DOWN_ARROW) {
     camera.walk(-1);
  }else if (keyCode === LEFT_ARROW) {
	 camera.turn(-1);
  }else if (keyCode === RIGHT_ARROW) {
     camera.turn(1);
  }
  return false; // prevent default
}


function simpleRotate3d(point,angle){
	var cos = Math.cos(angle);
	var sin = -Math.sin(angle);
	rotatedX = point.x * cos - point.z * sin;
	rotatedY = point.y;
    rotatedZ = point.z * cos + point.z * sin;
	return {"x":rotatedX,"y":rotatedY,"z":rotatedZ}
}