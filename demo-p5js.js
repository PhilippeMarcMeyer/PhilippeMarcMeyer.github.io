/*
	x = r sin(Lon) cos(lat)
	y = r sin(Lon) sin(lat)
	z = r cos(Lon)
	
	translated from https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_026_SuperShape3D/CC_026_SuperShape3D.pde
	in p5.js
*/

var spericalGeometry = {
	r : 160,
	total : 28,
	starNr : 75,
	globe : [],
	offset : 0,
	auto : true,
	lastRotationX:0,
	lastRotationY:0,
	startBg :null
};



 function setup(){
  var cnv = createCanvas(640,480,WEBGL);
  cnv.parent('demoZone');
  cnv.mousePressed(function(){
	 spericalGeometry.auto = !spericalGeometry.auto;
  });

  frameRate(30);
  spericalGeometry.startBg = createGraphics(640,480);

  spericalGeometry.startBg.fill(245);
  

 spericalGeometry.globe = [];

 var sign = "*";

 for(var i = 0;i < spericalGeometry.starNr;i++){
	var rx = random(640); 
	var ry = random(480); 
	var rsize = random(24)+12;
	
	
	if(rsize > 12){
		spericalGeometry.startBg.textSize(rsize);
		spericalGeometry.startBg.text('*', rx, ry);
	}else{
		spericalGeometry.startBg.ellipse(rx,ry,rsize);
	}
 }
 spericalGeometry.startBg.filter(ERODE,BLUR); // DILATE ,BLUR ,POSTERIZE,

 spericalGeometry.globe = [];
	for(var i = 0; i < spericalGeometry.total+1; i++){
		var lat = map(i,0,spericalGeometry.total,0, PI);
		spericalGeometry.globe.push([]);
		for(var j = 0; j < spericalGeometry.total+2; j++){
			var lon = map(j,0,spericalGeometry.total+1,0,  TWO_PI);
			var x = spericalGeometry.r * sin(lat) * cos(lon);
			var y = spericalGeometry.r * sin(lat) * sin(lon);
			var z = spericalGeometry.r * cos(lat);
			spericalGeometry.globe[i].push(createVector(x,y,z));
		}
	}
 }
 spericalGeometry.offset=0;
 function draw(){
	// offset++;
	 
  background(0);
  texture(spericalGeometry.startBg);
  plane(640,480);

  orbitControl();

	if(spericalGeometry.auto){
		spericalGeometry.lastRotationX = millis() / 4000;
		spericalGeometry.lastRotationY = millis() / 2000;
		rotateX(spericalGeometry.lastRotationX);
		rotateY(spericalGeometry.lastRotationY);
	}else{
		rotateX(spericalGeometry.lastRotationX);
		rotateY(spericalGeometry.lastRotationY);
		
	}

	for(var i = 1; i < spericalGeometry.total+1; i++){
			var hu = map(i, 0, spericalGeometry.total, 0, 255*6);
			fill((hu + spericalGeometry.offset)  % 250, 200, 200);
			
		//stroke(255);
		beginShape(TRIANGLE_STRIP);
		for(var j = 0; j < spericalGeometry.total+2; j++){

			var v1 = spericalGeometry.globe[i][j];	
			vertex(v1.x,v1.y,v1.z);
			//fill(200, 200, 200);
			var v2 = spericalGeometry.globe[i-1][j];
			vertex(v2.x,v2.y,v2.z);
		}
		endShape();
	}
 }
 
