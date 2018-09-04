

var globals = {
	mainHeight : 480,
	mainWidth : 480,
	radius : 200,
	timeTable :2,
	numberPoints : 10
};


 function setup(){
	var cnv = createCanvas(480, 480);
    cnv.parent('canvasZone');
	noFill();
	stroke(255);
	noLoop();
 }
 
 function draw(){
  translate(width / 2, height / 2); 
  background(0);
  ellipse(0, 0, globals.radius*2, globals.radius*2);
 }
 
