
var globals = {
	mainHeight : 480,
	mainWidth : 480,
	radius : 200,
	timeTable :5,
	numberPoints : 60,
	points : [],
	rotation : 0,
	color: "#ccccef",
	bg:"#000",
	frameRate :20,
	grow : true,
	xRatio : 1,
	yRatio : 1,
	offset : 0.025,
	pleaseWait : true,
	counterMax : 10,
	counter: 10,
	grot :0
};

function setup() {
   var cnv = createCanvas(globals.mainWidth, globals.mainHeight);
    cnv.parent('canvasZone');
	generate();
	frameRate(globals.frameRate);
}

function draw() {

	if(globals.xRatio > 1){
		globals.xgrow = false;
		globals.xRatio = 1;
		globals.pleaseWait = true;
		globals.counter = globals.counterMax;
		globals.grot = 0;
	}
	
	if(globals.xRatio < 0){
		globals.xgrow = true;
		globals.xRatio = 0;
		globals.pleaseWait = true;
		globals.counter = globals.counterMax;
		globals.yRatio = 0;
	}
	
	if(!globals.pleaseWait){
		if(globals.xgrow){
			globals.xRatio += globals.offset;
		}else{
			globals.xRatio -= globals.offset;
		}
	}else{
		if(globals.yRatio < (1 - globals.offset)){
			globals.yRatio += globals.offset;
		}
		globals.counter --;
		if(globals.counter<=0){
			globals.pleaseWait = false;
		}
	}
	
	translate(width / 2, height / 2); 
	background(globals.bg);
	stroke(255);
	noFill();
	drawCircle();
	drawCircle(0.8);
	drawCircle(0.7);
	drawCircle(0.6);
}

 function generate(){
	 globals.points = [];
	 globals.rotation = TWO_PI / globals.numberPoints;
	 for(var i = 0; i < globals.numberPoints; i++){
		 var rot = i*  globals.rotation;
		 var x = -cos(rot)*globals.radius;
		 var y = -sin(rot)*globals.radius;
		 globals.points.push({x:x,y:y});
	 }
 }

function drawCircle(ratio){
	rotate(globals.grot);
	if(!ratio) ratio = 1;
	scale(ratio,ratio);
	var numberPoints = globals.numberPoints;
	var points = globals.points.slice(0);
	 for(var i = 1; i < numberPoints; i++){
			 var x1 = points[i-1].x*globals.xRatio;
			 var x2 = points[i].x * globals.xRatio;
			 var y1 = points[i-1].y;
			 var y2 = points[i].y;
			 
			 
		 	line(x1,y1,x2,y2);
			line(0 ,0,x2,y2);
	}
		 var x1 = points[numberPoints-1].x*globals.xRatio;
		 var x2 = points[0].x * globals.xRatio;
		 var y1 = points[numberPoints-1].y;
		 var y2 = points[0].y;
		 
		line(x1,y1,x2,y2);
		line(0 ,0,x2,y2);
}

function floor(n){
	var i;
	i= n << 0;
	return i;
}

function simpleRotate(point,angle){
	var cos = Math.cos(angle);
	var sin = -Math.sin(angle);
	rotatedX = point.x * cos - point.y * sin;
    rotatedY = point.y * cos + point.x * sin;
	return {"x":rotatedX,"y":rotatedY}
}
