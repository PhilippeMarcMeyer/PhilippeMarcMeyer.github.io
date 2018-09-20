var _PI = Math.PI;
var _PIx2 = _PI * 2;
var _HALF_PI = _PI/2;
var _TRIANGLE = _PIx2 / 3;

var _timer = 0;
var _frameCount = 0;
var _animSteps = 60;
var _previous = null;
var _wait = 0;

var globals = {
	mainHeight : 480,
	mainWidth : 480,
	radius : 200,
	numberPoints : 48, // this minus 3 must be divisible by 3 : ex (3 * 11) + 3 = 36
	circlePoints : [],
	trianglePoints : [],
	mode : "P2D",
	angleOffset:0,
	rotA : _HALF_PI,
	rotB : _HALF_PI + _TRIANGLE,
	rotC : _HALF_PI + 2*_TRIANGLE,
	fr:25,
	drawPoints : false
};

function setup() {
	
var mode = (globals.mode == "WEBGL") ? WEBGL : P2D;
var cnv = createCanvas(globals.mainWidth,globals.mainHeight,mode);
    cnv.parent('canvasZone');
	globals.angleOffset = TWO_PI / globals.numberPoints;
	frameRate(globals.fr);
	makeCircle();
	makeTriangle();
}

function makeTriangle(){
	globals.trianglePoints = [];
	var h,w;
	var nrPointsInBranch = (globals.numberPoints - 3) / 3;
	var steps = nrPointsInBranch +1;
	var sinceGlobalPoint = 0;
	
	var x = -cos(globals.rotA)*globals.radius;
	var y = -sin(globals.rotA)*globals.radius; 
	var ptA = {x:x,y:y,r:globals.rotA,name:"A","textXY":{x:x-4,y:y-10}};
	
	x = -cos(globals.rotB)*globals.radius;
	y = -sin(globals.rotB)*globals.radius; 
	var ptB = {x:x,y:y,r:globals.rotB,name:"B","textXY":{x:x+10,y:y+10}};
	
	x = -cos(globals.rotC)*globals.radius;
	y = -sin(globals.rotC)*globals.radius; 
	var ptC = {x:x,y:y,r:globals.rotC,name:"C","textXY":{x:x-20,y:y+10}};
	
	for(var i = 0; i < globals.numberPoints; i++){
		var rot = i*globals.angleOffset + _HALF_PI;
		if(rot == globals.rotA){
			
			sinceGlobalPoint = 0;
			globals.trianglePoints.push(ptA);

		}else if(rot == globals.rotB){
			
			sinceGlobalPoint = 0;
			globals.trianglePoints.push(ptB);

		}else if(rot == globals.rotC){
			
			sinceGlobalPoint = 0;
			globals.trianglePoints.push(ptC);

		}else{
			sinceGlobalPoint ++;
			if(rot > globals.rotA && rot < globals.rotB){
				w = ptB.x - ptA.x;
				h = ptB.y - ptA.y;
				x = ptA.x + (w/steps*sinceGlobalPoint);
				y = ptA.y + (h/steps*sinceGlobalPoint);
				globals.trianglePoints.push({x:x,y:y});
					
			}else if(rot > globals.rotB && rot < globals.rotC){
				w = ptC.x - ptB.x;
				h = ptC.y - ptB.y;
				x = ptB.x + (w/steps*sinceGlobalPoint);
				y = ptB.y + (h/steps*sinceGlobalPoint);
				globals.trianglePoints.push({x:x,y:y});
			}else {
				w = ptA.x - ptC.x;
				h = ptA.y - ptC.y;
				x = ptC.x + (w/steps*sinceGlobalPoint);
				y = ptC.y + (h/steps*sinceGlobalPoint);
				globals.trianglePoints.push({x:x,y:y});
			}
		}

	}
	
}

function draw() {
	_timer = Math.floor(frameCount / (globals.fr/6)) % _animSteps;
	background(255);
	stroke(0);
	translate(width / 2, height / 2); 
	if(_wait<=0){
		drawTriangle();
	}else{
		drawCircle();
		_wait--;
	}
}

function makeCircle(){
	var rot;
	globals.circlePoints = [];
	for(var i = 0; i < globals.numberPoints; i++){
		var rot = i*globals.angleOffset + _HALF_PI;
		var x = -cos(rot)*globals.radius;
		var y = -sin(rot)*globals.radius; 
		globals.circlePoints.push({x:x,y:y,r:rot});
	}
}

function drawTriangle(){
	stroke(200);
	var last;
	for(var i = 0; i < globals.trianglePoints.length; i++){
		var p = globals.trianglePoints[i];
		
		var c = globals.circlePoints[i];
		
		var ratio = _timer / _animSteps;
		
		var x = p.x;
		var y = p.y;
		
		if(ratio > 0){
			var w = c.x - p.x;
			var h = c.y - p.y;
			x += ratio * w;
			y += ratio * h;
		}
		if(globals.drawPoints){
			ellipse(x, y, 2, 2);
		}
		
		if(p.name) {
			stroke(255,0,0);
			text(p.name,p.textXY.x, p.textXY.y);
			stroke(0);
		}
		
		if(i==0){
			_previous = p;
			last = p;
		}else{
			line(_previous.x, _previous.y, x, y);
			_previous = {x:x,y:y};
			if(i==globals.trianglePoints.length-1){
			line( x, y,last.x, last.y);
			}
		}
	}	
	if(	_timer == _animSteps-1){
		drawCircle();
		_wait = 60;
	}
	

}

function drawCircle(){
	
	stroke(0);
	
	for(var i = 0; i < globals.circlePoints.length; i++){
		var p = globals.circlePoints[i];
		var q;

		if(i == globals.circlePoints.length-1){
			q = globals.circlePoints[0];

		}else{
			q = globals.circlePoints[i+1];
		}
	
		arc(0, 0,globals.radius*2,globals.radius*2,p.r,q.r);
		
		if(globals.trianglePoints[i].name) {
			stroke(255,0,0);
			text(globals.trianglePoints[i].name,globals.trianglePoints[i].textXY.x, globals.trianglePoints[i].textXY.y);
			stroke(0);
		}
		
	}
	
	if(globals.drawPoints){
		stroke(0);
		for(var i = 0; i < globals.circlePoints.length; i++){
			var p = globals.circlePoints[i];
			ellipse(p.x, p.y, 4, 4);
		}
		ellipse(0 ,0, 6, 6);
	}

}