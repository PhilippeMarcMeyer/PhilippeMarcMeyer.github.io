

var fractals = {
	mainHeight : 360,
	mainWidth : 120,
	decreasing : 0.3, 
	iterations : 12,
	bottom : 180,
	triangles : []
};



function branch(basePt,angle,width,height,iter,maxIter){
	
	var pt1 = {x:basePt.x,y:basePt.y};
	var pt2 = {x:basePt.x+width,y:basePt.y};
	var pt3 = {x:basePt.x,y:basePt.y-height};

	fractals.triangles.push({a:pt1,b:pt2,c:pt3});
	
	pt1 = {x:basePt.x,y:basePt.y};
	pt2 = {x:basePt.x-width,y:basePt.y};
	pt3 = {x:basePt.x,y:basePt.y-height};

	fractals.triangles.push({a:pt1,b:pt2,c:pt3});
	
	if(iter < maxIter){
		basePt.y -= iter;
		branch(basePt,angle,width*.9,height*0.9,iter+1,maxIter)
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
  //noFill();
  stroke(255);
  fractals.triangles.forEach(function(tri,i){
	  fill(45+i*4);
	  //rotate(i*0.2)
	  //rotate(i*0.5);

	  
	  beginShape(TRIANGLE_STRIP);
		vertex(tri.a.x, tri.a.y);
		vertex(tri.b.x, tri.b.y);
		vertex(tri.c.x, tri.c.y);
		endShape();
  });

  //orbitControl();

 }
 
