
var globals = {
	mode: "WEBGL", // "WEBGL" or "P2D"
	mainHeight : 480,
	mainWidth : 480,
	radius : 200,
	numberPoints : 48,
	circlePoints : [],
	rectPoints : [],
	rotation : 0,
	color: "#ccccef",
	bg:"#000",
	frameRate :20,
	grow : false,
	xRatio : 0,
	yRatio : 1,
	sphereSize :24,
	sphereCurrent :0,
	offset : 0.025,
	colorOffset : 0,
	pleaseWait : false,
	counterMax : 10,
	movingColors : false,
	counter: 10,
	gXrot :0,
	gXmove :0,
	gYmove :0,
	scale:1,
	minRadius : 100,
	steps : [ // in seconds
		{"name":"grow","max":5,"current":0,"amount":1},
		{"name":"wait","max":0.1,"current":0,"amount":1},
		{"name":"antistar","max":2,"current":0,"amount":2},
		{"name":"star","max":2,"current":0,"amount":2},
		{"name":"turn","max":6,"current":0,"amount":0.03},
		{"name":"turn","max":4.1,"current":0,"amount":-0.03},
		{"name":"wait","max":0.1,"current":0,"amount":1}
	],
	currentStep : 0
};

function setup() {
var mode = (globals.mode == "WEBGL") ? WEBGL : P2D;
   var cnv = createCanvas(globals.mainWidth,globals.mainHeight,mode);
    cnv.parent('canvasZone');
	// Seconds to frames
	globals.steps.forEach(function(x){
		x.max *= globals.frameRate;
	});
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
	generateShape();

	if(globals.xRatio > 1){
		/*
		globals.xgrow = false;
		globals.xRatio = 1;
		globals.pleaseWait = true;
		globals.counter = globals.counterMax;
		globals.gXrot = 0;
		*/
		globals.xRatio = 1;
		if(globals.currentStep == 0){
			globals.currentStep ++;
		}
		
	}
	
	if(globals.xRatio < 0){
		globals.xgrow = true;
		globals.xRatio = 0;
		//globals.pleaseWait = true;
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
	if(globals.mode == "P2D"){
		translate(width / 2, height / 2); 
	}
	background(10);

  
	stroke(255);
	noFill();
	if(globals.mode == "WEBGL"){
		drawWEBGLCircle();
	}else{
		drawCircle();
	}
	

}

 function generateShape(){
	 globals.movingColors = false;

	var step = globals.steps[globals.currentStep]
	 if(step.name == "wait") return;
	 
	 if(step.name == "turn"){
		//globals.gXrot += globals.steps[globals.currentStep].step;
		globals.movingColors = true;
	 return;
	 }
	 globals.circlePoints = [];
	 globals.rotation = TWO_PI / globals.numberPoints;

	 var mult = globals.steps[globals.currentStep].amount;
	 var max = globals.steps[globals.currentStep].max;
	   if(step.name == "star" || step.name == "antistar"){
		  var progressStep =  ((globals.radius - globals.minRadius) * mult) / max ;
	   }
	 for(var i = 0; i < globals.numberPoints; i++){
		 var rot = i*globals.rotation - (globals.rotation/2);
		 if(step.name == "circle" || step.name == "grow"){
			var x = -cos(rot)*globals.radius;
			var y = -sin(rot)*globals.radius; 
		 }else if (step.name == "star") {
			 if(i%2==1){
				 var radius = globals.minRadius+(progressStep*step.current);
				 if(radius > globals.radius) radius = globals.radius;

				 var x = -cos(rot)*radius;
				 var y = -sin(rot)*radius;
			 } else{
				var x = -cos(rot)*globals.radius;
				var y = -sin(rot)*globals.radius;  
				}
		 }else if (step.name == "antistar") {
			 if(i%2==1){
				 var radius = globals.radius-(progressStep*step.current);
				 if(radius < globals.minRadius) radius = globals.minRadius;
				 var x = -cos(rot)*radius;
				 var y = -sin(rot)*radius;
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
 
 function drawWEBGLCircle(){
	 	 var step = globals.steps[globals.currentStep];
	  orbitControl();
	 colorMode(RGB);
	 if(step.name == "turn"){
		 if(step.amount < 0 && step.current == 0){
			 globals.scale = 0.01;
		 }
		  if(step.amount >= 0 ) {
			  		  globals.gXrot +=step.amount;

			 if (globals.gXrot > PI/3){
				globals.gXrot = PI/3; 
				globals.scale -= 0.01;
			    globals.gXmove = 0;
			    globals.gYmove -=2 + random(0,3);
			 }else{
				globals.scale = 1;
			    globals.gXmove = 0;
			    globals.gYmove = 0;
			 }			  
		  }
		else{
			globals.gXrot -=step.amount;

			if (globals.gXrot < -PI/3){
			  globals.gXrot = -PI/3;
			  globals.scale += 0.01;
			  globals.gXmove = 0;
			  globals.gYmove +=2;
			}
			else{
			  globals.scale += 0.01;
			  globals.gXmove = 0;
			  globals.gYmove +=2;
			}	
		}
	 }
	 else{
		 globals.gXrot =0;
		 globals.scale = 1;
		 globals.gXmove = 0;
		 globals.gYmove = 0;
	 }
	 
	 if(globals.scale < 0.01) globals.scale = 0.01;
	 if(globals.scale > 1) globals.scale = 1;

	rotateX(globals.gXrot);
	scale(globals.scale);
	translate(globals.gXmove,globals.gYmove);
     var colors = ["silver","white"];
	 var x1,x2,y1,y2,x3,y3;

	//noStroke();
	var numberPoints = globals.numberPoints;
	var midPoint = floor(numberPoints / 2);
	var points = globals.circlePoints.slice(0);
	
	if(globals.movingColors){
		globals.colorOffset = (globals.colorOffset +1)%2;
		
	}else{
		globals.colorOffset = 0;
	}
	beginShape(TRIANGLE_STRIP);
		fill(colors[globals.colorOffset]);	
		 x1 = points[numberPoints-1].x*globals.xRatio;
		 x2 = points[0].x * globals.xRatio;
		 y1 = points[numberPoints-1].y;
		 y2 = points[0].y;
		vertex(x1,y1,x2,y2);
		vertex(0 ,0,x2,y2);
	 for(var i = 1; i < numberPoints; i++){
			fill(colors[(i+globals.colorOffset)%2]);	
			 x1 = points[i-1].x*globals.xRatio;
			 x2 = points[i].x*globals.xRatio;
			 y1 = points[i-1].y;
			 y2 = points[i].y;
			 
			vertex(x1,y1,x2,y2);
			vertex(0 ,0,x2,y2);
	}

		fill(colors[globals.colorOffset]);	
		 x1 = points[numberPoints-1].x*globals.xRatio;
		 x2 = points[0].x * globals.xRatio;
		 y1 = points[numberPoints-1].y;
		 y2 = points[0].y;
		 
		vertex(x1,y1,x2,y2);
		vertex(0,0,x2,y2);
	 endShape();
	  if(step.name == "turn"){
		  globals.sphereCurrent += 0.5;
		  if(globals.sphereCurrent  > globals.sphereSize)
			  globals.sphereCurrent  = globals.sphereSize;
		  	sphere(globals.sphereCurrent);
	  }
	
	else
		globals.sphereCurrent = 0;
 }

function drawCircle(){
	var step = globals.steps[globals.currentStep];
	rotate(globals.gXrot);
	stroke(255);
	var numberPoints = globals.numberPoints;
	var points = globals.circlePoints.slice(0);
	 for(var i = 1; i < numberPoints; i++){
		 fill(100 + (i%155));
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
