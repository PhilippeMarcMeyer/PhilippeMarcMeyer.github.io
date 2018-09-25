// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/IKB1hWWedMk

// Edited by SacrificeProductions

var cols, rows;
var scl = 20;
var w = 1400;
var h = 1000;
var minValue = -100;

var terrain = [];

function setup() {
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
      xoff += 0.2;
    }
    yoff += 0.2;
  }
}

function draw() {

 orbitControl();
  background(100,120,140);
  translate(0, 50);
  rotateY(PI);
  rotateX(-PI/3);
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
}
