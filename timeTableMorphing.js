var _PI = Math.PI;
var _PIx2 = _PI * 2;
var _HALF_PI = _PI/2;
var _TRIANGLE = _PIx2 / 3;

var _timer = 0;
var _frameCount = 0;
var _animSteps = 80;
var _previous = null;
var _thickness = 1;
var _growing = true;
var _passedFirst = false;

var globals = {
	mainHeight : 416,
	mainWidth : 384,
	radius : 168,
	numberPoints : 123, // this minus 3 must be divisible by 3 : ex (3 * 11) + 3 = 36
	circlePoints : [],
	trianglePoints : [],
	mode : "P2D",
	angleOffset:0,
	rotA : _HALF_PI,
	rotB : _HALF_PI + _TRIANGLE,
	rotC : _HALF_PI + 2*_TRIANGLE,
	fr:40,
	drawPoints : false,
	foregroundColor : 255,
	backgroundColor : 0,
	timeTable : 2
};

function setup() {
	
var mode = (globals.mode == "WEBGL") ? WEBGL : P2D;
var cnv = createCanvas(globals.mainWidth,globals.mainHeight,mode);
    cnv.parent('canvasZone');
	globals.angleOffset = TWO_PI / globals.numberPoints;
	frameRate(globals.fr);
	strokeWeight(_thickness);
	noFill();
	textSize(16);
	makeCircle();
	makeTriangle();
	_timer = 0;
	_growing = true;
}

function draw() {
	 background(globals.backgroundColor);
	 if(_growing){
		 if(_timer >= _animSteps -2)
			_timer += 0.25;
			else 
			_timer++;
		 if(_timer == _animSteps -1){
			 _growing = false;
		 }
	 }else{
			_timer--;
		 if(_timer == 1){
			 _growing = true;
		 }

	 }

	stroke(globals.foregroundColor);
	translate(width / 2, (height / 2) + 20); 
	drawTriangle();


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
	stroke(globals.foregroundColor);
	var last,ratio,x,y,w,h;
	var savePoints = [];

	for(var i = 0; i < globals.trianglePoints.length; i++){
		var p = globals.trianglePoints[i];
		var c = globals.circlePoints[i];
		
		w = c.x - p.x;
		h = c.y - p.y;
	
		ratio = (_timer*_timer) / (_animSteps*_animSteps) ;
		x = p.x + ratio * w;
		y = p.y + ratio * h;	
		
		savePoints.push({x:x,y:y});

		if(globals.drawPoints){
			ellipse(x, y, 2, 2);
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
	
	push();
	strokeWeight(1);
	noFill()
	
	for(var i = 0; i < globals.numberPoints; i++){
		j = (i * globals.timeTable) % globals.numberPoints;
		var r = 155+i%80;
		var g = 155+j%80;
		var b = 155+i%47;
		stroke(r,g,b);
		line(savePoints[i].x,savePoints[i].y,savePoints[j].x,savePoints[j].y);
	}
	pop();

}

function drawCircle(){
	stroke(globals.foregroundColor);

	for(var i = 0; i < globals.circlePoints.length; i++){
		var p = globals.circlePoints[i];
		var q;

		if(i == globals.circlePoints.length-1){
			q = globals.circlePoints[0];

		}else{
			q = globals.circlePoints[i+1];
		}
	
		arc(0, 0,globals.radius*2,globals.radius*2,p.r,q.r);
		
		
	}
	
	if(globals.drawPoints){
		stroke(globals.foregroundColor);
		for(var i = 0; i < globals.circlePoints.length; i++){
			var p = globals.circlePoints[i];
			ellipse(p.x, p.y, 4, 4);
		}
		ellipse(0 ,0, 6, 6);
	}

}