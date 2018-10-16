/*
	x = r sin(Lon) cos(lat)
	y = r sin(Lon) sin(lat)
	z = r cos(Lon)
	
	translated from https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_026_SuperShape3D/CC_026_SuperShape3D.pde
	in p5.js
*/

var globals = {
	r : 140,
	definition : 24,
	starNr : 75,
	globe : [],
	offset : 0,
	auto : false,
	initialRotation : null,
	lastRotationX:0.5,
	lastRotationY:0,
	lastRotationZ:0,
	startBg :null,
	w : 640,
	h : 480,
	sunLight : null,
	colors :[
		{r:116,g:73,b:73},
		{r:128,g:64,b:64},
		{r:154,g:78,b:78},
		{r:172,g:89,b:89},
		{r:187,g:106,b:102},
		{r:197,g:137,b:92},
		{r:197,g:137,b:92},
		{r:68,g:146,b:46},
		{r:68,g:146,b:46},
		{r:87,g:186,b:58},
		{r:255,g:108,b:108},
		{r:255,g:255,b:255}
	]
};

var startBeam,endBeam;

 function setup(){
  var cnv = createCanvas(globals.w,globals.h,WEBGL);
  cnv.parent('demoZone');
  cnv.mousePressed(function(){
	 globals.auto = !globals.auto;
  });
  
  globals.sunLight = createVector(-HALF_PI,0,HALF_PI);
  globals.lastRotationX = HALF_PI;
 // frameRate(30);
  globals.startBg = createGraphics(globals.w,globals.h);

  globals.startBg.fill(245);
  
  globals.globe = [];
 
var rxOld = random(-100,globals.w+100); 
var ryOld = random(globals.h); 
globals.startBg.stroke(255);
	
 for(var i = 0;i < globals.starNr;i++){
	var rx = random(globals.w); 
	var ry = random(globals.h); 
	globals.startBg.line(rxOld,ryOld,rx,ry);
	rxOld = rx;
	ryOld = ry;
 }

globals.startBg.filter(ERODE,DILATE); // DILATE ,BLUR ,POSTERIZE,
globals.startBg.ellipseMode(CENTER)
globals.startBg.stroke("yellow");
startBeam = {x:globals.sunLight.x,y:globals.sunLight.y,z:globals.sunLight.z};
endBeam = {x:0,y:0,z:0};



 globals.globe = [];
	for(var i = 0; i < globals.definition+2; i++){
		var lat = map(i,0,globals.definition,0, PI);
		globals.globe.push([]);
		for(var j = 0; j < globals.definition+2; j++){
			var lon = map(j,0,globals.definition+1,0,  TWO_PI);
			
			var x = sin(lat) * cos(lon);
			var y = sin(lat) * sin(lon);
			var z = cos(lat);
			var normale = createVector(x,y,z);
			x = globals.r * x;
			y = globals.r * y;
			z = globals.r * z;
			var pt = createVector(x,y,z);
			var isBeacon = (random() <= 0.08);
			globals.globe[i].push({
			"point":pt,
			"normale":normale,
			"beacon":{
				"isBeacon" : isBeacon,
				"beaconData":[],
				"beaconMax": map(random(),0,1,10,25)
				}
			});
		}
	}
	
	for(var i = 1; i < globals.definition+1; i++){
		for(var j = 0; j < globals.definition+2; j++){
				globals.globe[i][j].point = doRotate(globals.globe[i][j].point,0,HALF_PI,0);
				globals.globe[i][j].normale.x = globals.globe[i][j].point.x / globals.r;
				globals.globe[i][j].normale.y = globals.globe[i][j].point.y / globals.r;
				globals.globe[i][j].normale.z = globals.globe[i][j].point.z / globals.r;

			}
    }
 }
 globals.offset=0;
 
var deltaZ = 0.009;
var deltaX = 0.1;
var deltaY = 0;	
 function draw(){	 
  background(0);

  texture(globals.startBg);
  plane(globals.w,globals.h);

line(startBeam.x,startBeam.y,startBeam.z,endBeam.x,endBeam.y,endBeam.z);

	if(abs(globals.lastRotationZ) >= 0.3){
		deltaZ*=-1;
		
	}

	globals.lastRotationX+=deltaX;
	globals.lastRotationZ+=deltaZ;	
		



	if(deltaX!=0){
			for(var i = 1; i < globals.definition+1; i++){
				for(var j = 0; j < globals.definition+2; j++){
				globals.globe[i][j].point = doRotate(globals.globe[i][j].point,deltaX,deltaY,deltaZ);
				globals.globe[i][j].normale.x = globals.globe[i][j].point.x / globals.r;
				globals.globe[i][j].normale.y = globals.globe[i][j].point.y / globals.r;
				globals.globe[i][j].normale.z = globals.globe[i][j].point.z / globals.r;

			}
			}
	}
	
	for(var i = 1; i < globals.definition+1; i++){
		beginShape(TRIANGLE_STRIP);
		for(var j = 0; j < globals.definition+2; j++){
			var mainPt = globals.globe[i][j];
			var color = {r:45,g:45,b:55};
			var dot = scalarProduct(mainPt.normale,globals.sunLight);
			 if(dot >= 0){
				 var lightStrength = round(dot*dot*30);
				color.r += lightStrength;
				color.g += lightStrength;
				color.b += lightStrength*0.9;
			 }
			if(dot >= 0.6){
				 var lightStrength = 1;
				color.r += lightStrength;
				color.g += lightStrength;
				color.b += lightStrength;
			 } 
			fill(color.r,color.g,color.b);
			var v1 = mainPt.point;	
			vertex(v1.x,v1.y,v1.z);
			var v2 = globals.globe[i-1][j].point;
			vertex(v2.x,v2.y,v2.z);

		}
		endShape();
	}
	
	for(var i = 1; i < globals.definition; i++){
			for(var j = 0; j < globals.definition; j++){
				var mainPt = globals.globe[i][j];{
					if(mainPt.beacon.isBeacon){
					var data = mainPt.beacon.beaconData;
					var linesMax = mainPt.beacon.beaconMax;
					var len = data.length;
					if(len > linesMax || len == 0){
						data.length = 0;
						data.push({"i":i,"j":j});
					}
					
					addNextPoint(data);
					drawBeaconTrail(data);
				
				}
			}
			
	}
  }
}

 function drawBeaconTrail(data){
	 		push();
			stroke(255,240,80);
			noFill();
			for(var x= 0; x < data.length-1;x++){
				var root = globals.globe[data[x].i][data[x].j].point;
				var next = globals.globe[data[x+1].i][data[x+1].j].point;
				line(root.x, root.y, root.z, next.x, next.y, next.z);
			}		
			pop();
 }
 
 function addNextPoint(data){
	var len = data.length;

	var root = data[len-1]; 
	var i = root.i;
	var j = root.j;
	var nextI = i;
	var nextJ = j;
	var test4Directions = round(map(random(),0,1,1,4));
	if(test4Directions== 1){
		// top
		nextI = i-1;
		if (nextI < 0) nextI = globals.definition -1;
	}else if(test4Directions== 2){
		// right
		var nextJ = j+1;
		if (nextJ > globals.definition -1) nextJ = 0;
	}else if(test4Directions== 3){
		// bottom
		nextI = i+1;
		if (nextI > globals.definition -1) nextI = 0;
	}else if(test4Directions== 4){
		// left
		var nextJ = j-1;
		if (nextJ < 0) nextJ = globals.definition -1;
	}
 // TODO : check if the branch is already in the data array
 var notFound = true;
 data.forEach(function(d){
	 if(d.i == nextI && d.j == nextJ){
		 notFound = false;
	 }
 });
 if(notFound){
	data.push({"i":nextI,"j":nextJ});
 }
 }
 
function scalarProduct(a,b){
	return a.x*b.x+a.y*b.y+a.z*b.z;
}


function doRotate(vect,pitch, roll, yaw) {
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);

    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);

    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);

    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;

    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;

    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;

	var px = vect.x;
	var py = vect.y;
	var pz = vect.z;

	vect.x = Axx*px + Axy*py + Axz*pz;
	vect.y = Ayx*px + Ayy*py + Ayz*pz;
	vect.z = Azx*px + Azy*py + Azz*pz;
		
	return vect;
}

/*

vectorNormal=new vector(pointA.x,pointA.y,pointA.z);
dot=scalarProduct(vectorNormal,this.camera);
*/