
var globals = {
	mainHeight : 480,
	mainWidth : 480,
	radius : 200,
	numberPoints : 96,
	circlePoints : [],
	rectPoints : [],
	rotation : 0,
	color: "#ccccef",
	bg:"#000",
	frameRate :20,
	grow : true,
	xRatio : 0,
	yRatio : 1,
	offset : 0.025,
	pleaseWait : true,
	counterMax : 10,
	counter: 10,
	grot :0,
	steps : [
		{"name":"grow","max":40,"current":0},
		{"name":"star","max":120,"current":0},
		{"name":"antistar","max":120,"current":0},
		{"name":"circle","max":40,"current":0}
	],
	currentStep : 0
};

function setup() {
   var cnv = createCanvas(globals.mainWidth, globals.mainHeight);
    cnv.parent('canvasZone');
	frameRate(globals.frameRate);
}

function draw() {
		globals.steps[globals.currentStep].current ++;
	if(globals.steps[globals.currentStep].current >= globals.steps[globals.currentStep].max){
		globals.steps[globals.currentStep].current = 0;
		globals.currentStep++;
		if(globals.currentStep > globals.steps.length-1){
			globals.currentStep = 1;
		}
	}
	generateCircle(globals.steps[globals.currentStep]);

	if(globals.xRatio > 1){
		/*
		globals.xgrow = false;
		globals.xRatio = 1;
		globals.pleaseWait = true;
		globals.counter = globals.counterMax;
		globals.grot = 0;
		*/
		globals.xRatio = 1;
		if(globals.currentStep == 0){
			globals.currentStep ++;
		}
		
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
	/*
	drawCircle(0.8);
	drawCircle(0.7);
	drawCircle(0.6);
	*/
}

 function generateCircle(step){
	 globals.circlePoints = [];
	 globals.rotation = TWO_PI / globals.numberPoints;
	 for(var i = 0; i < globals.numberPoints; i++){
		 var rot = i*globals.rotation - (globals.rotation/2);
		 if(step.name == "circle" || step.name == "grow"){
			var x = -cos(rot)*globals.radius;
			var y = -sin(rot)*globals.radius; 
		 }else if (step.name == "star") {
			 if(i%2==1){
				 var x = -cos(rot)*(globals.radius-step.current+1);
				 var y = -sin(rot)*(globals.radius-step.current+1);
			 } else{
				var x = -cos(rot)*globals.radius;
				var y = -sin(rot)*globals.radius;  
				}
		 }else if (step.name == "antistar") {
			 if(i%2==1){
				 var x = -cos(rot)*(globals.radius-step.max+step.current+1);
				 var y = -sin(rot)*(globals.radius-step.max+step.current+1);
			 } else{
				var x = -cos(rot)*globals.radius;
				var y = -sin(rot)*globals.radius;  
				}
		 }
		 globals.circlePoints.push({x:x,y:y});
	 }
	 
 }
 
  function generateRect(){
	  var halfSide = cos(PI/4)*globals.radius;
	 globals.rectPoints = [];
	// globals.rotation = TWO_PI / globals.numberPoints;
	 for(var i = 0; i < globals.numberPoints; i++){
		// var rot = i*  globals.rotation;
		// var x = -cos(rot)*globals.radius;
		// var y = -sin(rot)*globals.radius;
		// globals.rectPoints.push({x:x,y:y});
	 }
 }

function drawCircle(ratio){
	rotate(globals.grot);
	stroke(255);
	var numberPoints = globals.numberPoints;
	var points = globals.circlePoints.slice(0);
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
		//drawSquare();
}

function drawSquare(){
	var halfSide = cos(PI/4)*globals.radius;
	rectMode(CENTER) ;
	stroke(255,0,0);
	rect(0,0,halfSide*2,halfSide*2);
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
