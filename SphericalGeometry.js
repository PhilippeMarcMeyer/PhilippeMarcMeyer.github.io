/*
	x = r sin(Lon) cos(lat)
	y = r sin(Lon) sin(lat)
	z = r cos(Lon)
	
	translated from https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_026_SuperShape3D/CC_026_SuperShape3D.pde
	in p5.js
*/
var globals = {
	r : 160,
	magStep : 1,
	maxElevation : 0,
	gridAtStage : 3,
	countElevation : 0,
	definition : 144,
	starNr : 75,
	globe : [],
	offset : 0,
	initialRotation : null,
	lastRotationX:0.5,
	lastRotationY:0,
	lastRotationZ:0,
	autoRotate:true,
	startBg :null,
	drawTrailDuring : 160,
	beaconDelay :0,
	beaconRatio : 0.022, // increase to spread land into scatrered islands, decrease to regroup land. plays with maxElevation also
	nrBeacons:0,
	maxBeacons :0,
	w : 640,
	h : 480,
	sunPosition  : null,
	sunSize : 40,
	sunLight : null,
	camera : null,
    colors : []
};

var startBeam,endBeam;
var deltaZ = 0.001* Math.pow(globals.definition,0.2);
var deltaX = 0.0025 * Math.pow(globals.definition,0.1);
var deltaY = 0;	
var cnv;
 function setup(){
	cnv = createCanvas(globals.w,globals.h,WEBGL);
	cnv.parent('demoZone');
	cnv.mouseMoved(changeCursor) ;
	frameRate(30);
	let baseColors=[
		color(50,50,200),
		color(70,65,50),
		color(70,90,50),
		color(75,95,55),
		color(80,100,60),
		color(75,100,75),
		color(60,102,102),
		color(60,102,110),
		color(60,102,115),
		color(150,150,150),
		color(200,200,200)
	];
	
	baseColors.forEach(function(c){
			let levels = c.levels;
			let r = c.levels[0];
			let g = c.levels[1];
			let b = c.levels[2];
			var ratios = [0.8,1.2,1.4,1.6];
			globals.colors.push({
				"darker":color(levels[0]*ratios[0],levels[1]*ratios[0],levels[2]*ratios[0]),
				"base":c,
				"lighter":color(levels[0]*ratios[1],levels[1]*ratios[1],levels[2]*ratios[1]),
				"light":color(levels[0]*ratios[2],levels[1]*ratios[2],levels[2]*ratios[2]),
				"lightest":color(levels[0]*ratios[3],levels[1]*ratios[3],levels[2]*ratios[3])
				});
		});		 
				 
	globals.maxElevation = globals.definition * globals.definition * 0.5;
	globals.maxBeacons =  globals.maxElevation*globals.beaconRatio;
	globals.beaconTrailColor = color(200,200,10);
	globals.sunLight = createVector(PI,-0.8,0);
	globals.camera = createVector(0,0,1);
	globals.lastRotationX = HALF_PI;
	startBeam = {x:globals.sunLight.x,y:globals.sunLight.y,z:globals.sunLight.z};
	endBeam = {x:0,y:0,z:0}; 
	makeBackground();
	globals.globe = [];
	makeGlobe();
 }
 
 function draw(){	 
	background(0);
	texture(globals.startBg);
	plane(globals.w,globals.h);
    drawGlobe();
}
 
 function addNextPoint(data){
	var len = data.length;
	var root = data[len-1]; 
	var i = root.i;
	var j = root.j;
	var nextI = i;
	var nextJ = j;
	var nrPoints = globals.globe[i].length;
	var foundNext = true;
	var test4Directions = round(map(random(),0,1,1,4));
	
	if(test4Directions== 1){
		// top
		nextI = i-1;
		if (nextI < 1) {
			foundNext = false;
			nextI = 1;
		}
	}else if(test4Directions== 2){
		// right
		foundNext = false;
	    if(nrPoints > 1){
			 foundNext = true;
			var nextJ = j+1;
			if (nextJ > globals.definition -1) {
				nextJ = j;
				foundNext = false;			
			}
		}
	}else if(test4Directions== 3){
		// bottom
		nextI = i+1;
		if (nextI > globals.definition -1) {
			nextI = i;
			foundNext = false;
		}
	}else if(test4Directions== 4){
		// left
		foundNext = false;
		 if(nrPoints > 1){
		   foundNext = true;
			var nextJ = j-1;
			if (nextJ < 1) {
				foundNext = false;
				nextJ = 1;
			}
		 }
	}
	 if(foundNext){
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
 function makeBackground(){
	globals.startBg = createGraphics(globals.w,globals.h);
	globals.startBg.fill(245);
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
	
	globals.startBg.noStroke();
	globals.startBg.translate(globals.w/2,globals.h/2);
	var sunCrest = color(240,240,80,70);
	var sunColor = color(240,240,80,100);
	var sunCore = color(240,240,80);
	
	var offsetX = -0.4*globals.w*cos(globals.sunLight.x);
	var offsetY = 0.4*globals.h*sin(globals.sunLight.y);
	globals.sunPosition = createVector(offsetX,offsetY);
	var sunSize = globals.sunSize;
	
	globals.startBg.fill(sunColor);
	globals.startBg.ellipse(offsetX,offsetY,5+sunSize*2,5+sunSize*2);
	
	globals.startBg.filter(ERODE,DILATE); // DILATE ,BLUR ,POSTERIZE,
	globals.startBg.fill(sunCore);
	globals.startBg.ellipse(offsetX,offsetY,sunSize*2,sunSize*2);
	
	var points = [];
	var numberPoints = globals.definition;//110
	var timeTable = round(random(21,37));//22
	 var rotation = TWO_PI / numberPoints;
	 for(var i = 0; i < numberPoints; i++){
		 var rot = i*  rotation;
		 var x = -cos(rot)*sunSize;
		 var y = -sin(rot)*sunSize;
		 points.push({x:x,y:y});
	 }
		 for(var i = 0; i < numberPoints; i++){
	  j = (i * timeTable) % numberPoints;
	  var r = 170+i%80;
	  var g = 10+j%80;
	  var b = 10+i%47;
	  globals.startBg.stroke(r,g,b);
	  dotsLine(points[i].x+offsetX,points[i].y+offsetY,points[j].x+offsetX,points[j].y+offsetY,globals.startBg);
  }
 }
 
 function makeGlobe(){
	var intermediatePointsNumber = globals.definition - 2;
	var segmentLength = globals.r / intermediatePointsNumber + 1;
	var segmentAngle = TWO_PI / globals.definition;
	var noiseVal = 0;
	var noiseScaleX=0.01;
	globals.globe = [];
	var k90 = radians(45);
	for(var i = 0; i < globals.definition+1; i++){
		var lat = segmentAngle* i;
		noiseScaleX+=noiseScaleX;
		globals.globe.push([]);
		for(var j = 0; j < globals.definition+1; j++){
			var lon =  segmentAngle * j;
			var x = sin(lat) * cos(lon);
			var y = sin(lat) * sin(lon);
			var z = cos(lat);
			var normale = createVector(x,y,z);
			x = globals.r * x;
			y = globals.r * y;
			z = globals.r * z;
			var pt = createVector(x,y,z);
			
			var isBeacon = (random()+noise(noiseScaleX)/20 <= globals.beaconRatio  && globals.nrBeacons <= globals.maxBeacons);
			globals.nrBeacons += isBeacon;
			globals.globe[i].push({ 
			"point":pt,
			"radius" : globals.r,
			"stage" : 0, // for color
			"grid" : null,
			"normale":normale,
			"beacon":{
				"isBeacon" : isBeacon,
				"beaconData":[],
				"beaconMax": map(random(),0,1,7,13),
				"beaconCounter": globals.beaconDelay
				}
			});
		}
	}
	
	for(var i =0; i < globals.definition+1; i++){
		for(var j = 0; j < globals.definition+1; j++){
				globals.globe[i][j].point = doRotate(globals.globe[i][j].point,0,HALF_PI,0);
				globals.globe[i][j].normale.x = globals.globe[i][j].point.x / globals.r;
				globals.globe[i][j].normale.y = globals.globe[i][j].point.y / globals.r;
				globals.globe[i][j].normale.z = globals.globe[i][j].point.z / globals.r;
		}
    } 	
 }
 
 function drawGlobe(){
	 if(globals.autoRotate){
		if(abs(globals.lastRotationZ) >= 0.3){
			deltaZ*=-1;
		}
		globals.lastRotationX+=deltaX;
		globals.lastRotationZ+=deltaZ;	
		if(frameCount < globals.drawTrailDuring){
			globals.lastRotationX+=deltaX*4;
			globals.lastRotationZ+=deltaZ*4;		
		}
		if(deltaX!=0){
			for(var i = 1; i < globals.definition; i++){
				var nrPoints = globals.globe[i].length;
				for(var j = 0; j < nrPoints; j++){
					globals.globe[i][j].point = doRotate(globals.globe[i][j].point,deltaX,deltaY,deltaZ);
					globals.globe[i][j].normale.x = globals.globe[i][j].point.x / globals.globe[i][j].radius;
					globals.globe[i][j].normale.y = globals.globe[i][j].point.y / globals.globe[i][j].radius;
					globals.globe[i][j].normale.z = globals.globe[i][j].point.z / globals.globe[i][j].radius;
				}
			}
		}
	 }
	var nbLat = globals.globe.length;
	for(var i = 1; i < nbLat; i++){
		beginShape(TRIANGLE_STRIP);
		noStroke();
		var nrPoints = globals.globe[i].length;
		for(var j = 0; j < nrPoints; j++){
			var mainPt = globals.globe[i][j];
			var dot = scalarProduct(mainPt.normale,globals.sunLight);
			  var intensity;
			  if(dot < 0.2){
				  intensity = "darker";
			  }else if(dot < 0.4){
				  intensity = "base";
			  }else if(dot < 0.6){
				  intensity = "lighter";
			  }else if(dot < 0.8){
				  intensity = "light";
			  }else{
				  intensity = "lightest";
			  }

			  fill(globals.colors[mainPt.stage][intensity]);
			  
		    //var stage1 = mainPt.stage;
			//var stage2 = globals.globe[i-1][j].stage;

			var v1 = mainPt.point;	
			vertex(v1.x,v1.y,v1.z);
			var v2 = globals.globe[i-1][j].point;
			//var stageDifference = abs(stage1- stage2);
			//if(stageDifference <= 1){
			//	vertex(v2.x,v2.y,v2.z);	
			//}else{
				/*
				var nrPointsBetween = stageDifference -1;
				var direction = (stage1> stage2) ? -1 : 1;
				var diffX = (v2.x - v1.x)/stageDifference;
				var diffY = (v2.y - v1.y)/stageDifference;
				var diffZ = (v2.z - v1.z)/stageDifference;
				for(var k = 1; k <= nrPointsBetween;k++){
					fill(globals.colors[mainPt.stage+(k*direction)][intensity]);
					vertex(v1.x+(k*diffX),v1.y+(k*diffY),v1.z+(k*diffZ));	

				}
				*/
				vertex(v2.x,v2.y,v2.z);	
			//}
		}
		endShape();
	}
	for(var i = 1; i < globals.definition; i++){
		var nrPoints = globals.globe[i].length;
			for(var j = 0; j < nrPoints; j++){
				var mainPt = globals.globe[i][j];{
					if(mainPt.beacon.isBeacon){
					var dotCam = scalarProduct(mainPt.normale,globals.camera);
					var dot = scalarProduct(mainPt.normale,globals.sunLight);
					if(dotCam > 0){
						var data = mainPt.beacon.beaconData;
						mainPt.beacon.beaconCounter--;
						if(mainPt.beacon.beaconCounter <= 0){
							var linesMax = mainPt.beacon.beaconMax;
							var len = data.length;
							if(len > linesMax || len == 0){
								if(data.length != 0){
									var result = testBeaconTrailForPattern(data);
									if(result.found){
										var pivotData = result.pivotData;
										var pivotPoint = globals.globe[pivotData.i][pivotData.j];
										if(pivotPoint.stage < globals.colors.length -1){
											if(globals.countElevation <= globals.maxElevation){
												pivotPoint.stage++;
												if(pivotPoint.stage == globals.gridAtStage){
													var xJ = pivotData.j;
													var xI = pivotData.i;
													//globals.globe[i][j]
												}
												pivotPoint.point.normalize();
												pivotPoint.radius+=globals.magStep;
												pivotPoint.point.setMag(pivotPoint.radius);
												globals.countElevation++;
												if(!pivotPoint.isBeacon && globals.nrBeacons <= globals.maxBeacons){
													if(random()>0.9){
														pivotPoint.beacon.isBeacon = true;
														pivotPoint.beacon.beaconData = [];
														pivotPoint.beacon.beaconMax = mainPt.beacon.beaconMax;
														pivotPoint.beacon.beaconCounter =globals.beaconDelay;
														globals.nrBeacons++;
													}
												}
											}
										}
									}
								}
								data.length = 0;
								data.push({"i":i,"j":j});
							}
							addNextPoint(data);
							mainPt.beacon.beaconCounter = globals.beaconDelay;
						}
						if(dot < 0.1){
							if( frameCount < globals.drawTrailDuring ||random() <0.01){
								if(globals.countElevation <= globals.maxElevation){
									drawBeaconTrail(data);
								}
							}
						}
					}
				}
			}
	}
  } 
}
function testBeaconTrailForPattern(data){
	// check if the trail make a little square
	var result = {found: false,pivotPoint:null};
	if(data.length >=4){
		for(var k= 0; k < data.length-1;k++){
			var pivotPoint = globals.globe[data[k].i][data[k].j].point;
			var pivotData = data[k];
				for(var l= 0; l < data.length-1;l++){
				    if(l!=k){
						var compareData =  data[l];
						if(pivotData.i == compareData.i && pivotData.j == compareData.j) {
						// we went back to the same point
							result.found = true;
							result.pivotData = pivotData; // maybe not the right one : sort
						}					
					}
				}
		}			
	}
	return result;
}
 function drawBeaconTrail(data){
	 if(data.length >0){
		push();
		stroke(255,0,0);
		noFill();
		var root = globals.globe[data[0].i][data[0].j].point;
		strokeWeight(2);
		//line(root.x, root.y, root.z, root.x+1, root.y+1, root.z+1);
		strokeWeight(1);
		stroke(globals.beaconTrailColor);
		for(var x= 0; x < data.length-1;x++){
			var root = globals.globe[data[x].i][data[x].j].point;
			var next = globals.globe[data[x+1].i][data[x+1].j].point;
			line(root.x, root.y, root.z, next.x, next.y, next.z);
		}		
		pop();
	 }
 }
 
 function dotsLine(x1,y1,x2,y2,g){
	
	var xDiff = x2 - x1;
	var yDiff = y2 - y1 ;
	var len = Math.floor(Math.sqrt(xDiff*xDiff + yDiff*yDiff));
	
	xDiff = xDiff/len;
	yDiff = yDiff/len;
	
	var x = x1;
	var y = y1;
	
	for(var i = 0; i < len;i++){
		 y+= yDiff;
		 x+= xDiff;
		 if(i%2==0){
		if(g){
			g.point(x,y);
		}else{
			point(x,y);
		}
		 }
	}
}



function changeCursor(){
	var mx = mouseX;
	var my = mouseY;
  
	var sunX = globals.sunPosition.x + globals.w/2;
	var sunY = globals.sunPosition.y + globals.h/2;
 
	var d = dist(mx, my, sunX, sunY);
	if(d < globals.sunSize){
	    cursor(HAND);
	}else{
		    cursor(ARROW);

	}
}

function mouseReleased() {
	var mx = mouseX;
	var my = mouseY;
  
	var sunX = globals.sunPosition.x + globals.w/2;
	var sunY = globals.sunPosition.y + globals.h/2;
 
	var d = dist(mx, my, sunX, sunY);
	if(d < globals.sunSize){
		globals.autoRotate = !globals.autoRotate;
	}
}

