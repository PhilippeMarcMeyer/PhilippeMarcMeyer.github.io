/*
	x = r sin(Lon) cos(lat)
	y = r sin(Lon) sin(lat)
	z = r cos(Lon)
	
	translated from https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_026_SuperShape3D/CC_026_SuperShape3D.pde
	in p5.js
*/

var fractals = {
	mainHeight : 360,
	mainWidth : 36,
	decreasing : 0.3, 
	iterations : 1,
	bottom : 180,
	triangles : []
};



function branch(basePt,angle,width,height,iter,maxIter){
	var pt2 = {x:basePt.x+width,y:basePt.y};
	var pt3 = {x:basePt.x,y:basePt.y-height};

	fractals.triangles.push({a:basePt,b:pt2,c:pt3});
	if(iter < maxIter){
		branch(basePt,angle,width,height,iter,maxIter)
	}
}

 function setup(){
	var cnv = createCanvas(480, 480);
    cnv.parent('canvasZone');
	angleMode(DEGREES);
	fractals.triangles = [];
	var basePt = {x:0,y:fractals.bottom};
	branch(basePt,0,fractals.mainWidth,fractals.mainHeight,1,fractals.iterations);
	console.log(fractals.triangles);
	noLoop();
 }
 
 function draw(){
	translate(width / 2, height / 2); 
  background(0);
    noFill();
  stroke(255);
  fractals.triangles.forEach(function(tri){
	  beginShape(TRIANGLE_STRIP);
		vertex(tri.a.x, tri.a.y);
		vertex(tri.b.x, tri.b.y);
		vertex(tri.c.x, tri.c.y);

	endShape();
  });

  //orbitControl();

 }
 
