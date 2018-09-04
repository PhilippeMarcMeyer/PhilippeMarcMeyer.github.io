

var globals = {
	mainHeight : 480,
	mainWidth : 480,
	radius : 200,
	timeTable :5,
	numberPoints : 201,
	points : [],
	rotation : 0,
	color: "#ccccef",
	bg:"#000"
};

 function setup(){
	var cnv = createCanvas(480, 480);
    cnv.parent('canvasZone');
	frameRate(5);
	generate();
	noFill();
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
 
 function draw(){
  translate(width / 2, height / 2); 
  var newNRPTS = parseInt($("#definition").val());
  var newTT = parseInt($("#timetable").val());
  if(newNRPTS != globals.numberPoints){
	  globals.numberPoints = newNRPTS;
	  generate();
  }
   if(newTT != globals.timeTable){
	  globals.timeTable = newTT;
  }
  var timeTable = globals.timeTable;
  var numberPoints = globals.numberPoints;
  var points = globals.points.slice(0);
  var j;

  background(globals.bg);

  for(var i = 0; i < numberPoints; i++){
	  j = (i * timeTable) % numberPoints;
	  var r = 155+i%80;
	  var g = 155+j%80;
	  var b = 155+i%47;
	  stroke(r,g,b);
	 line(points[i].x,points[i].y,points[j].x,points[j].y);
  }

 }
 
 $( document ).ready(function() {
	$("#definition").on("change",function(){
		$("#definitionInfo").text($(this).val());
	});	
	
	$("#timetable").on("change",function(){
		$("#timetableInfo").text($(this).val());
	});				
});
 

