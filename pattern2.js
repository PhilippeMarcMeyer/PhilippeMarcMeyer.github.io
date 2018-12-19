let w,h,cnv,nrSquares,squareSide,lcolor,dcolor;

function setup() {
	w = 560;
	h = 560;
	nrSquares = 7;
	squareSide = h / nrSquares;
	cnv = createCanvas(w+1, h+1);
	cnv.parent('canvasZone');
		
	  bgColor1 = color(70,19,57);
	  bgColor2 = color(125,34,103);
	  lcolor = color(34,103,125);
	  dcolor = color(19,57,70);
	  	 // lcolor = color(0,0,150);
	  //dcolor = color(0,0,90);
}

function draw() {
  	fill(6,21,26)
	stroke(6,21,26)
	rect(0,0,w,h,4)
  drawSketch();
}

function drawPattern(size,colorBg,ColorFgA,colorFgB,colorBg2){
	let newSize;
	var delta = 2;
	ellipseMode(CORNER)
	fill(colorBg)
	stroke(colorBg)
	rect(delta/2,delta/2,size-delta,size-delta,4);
	fill(ColorFgA)
	stroke(ColorFgA)
	ellipse(delta*2,delta*2,size-delta*3,size-delta*3);
	fill(colorFgB)
	stroke(colorFgB)
	delta = size * 0.15;
	rect(size*0.2,size *0.2,size*0.6,size *0.6,4);
	fill(ColorFgA)
	stroke(ColorFgA)
	ellipse(size*0.25,size*0.25,size*0.5,size*0.5);
	fill(colorFgB)
	stroke(colorFgB)
	delta = size * 0.075;
	rect(size*0.3375,size*0.3375,size*0.325,size *0.325,4);
	fill(colorBg2)
	stroke(colorBg2)
	ellipse(size*0.38,size*0.38,size*0.25,size*0.25);
}

function drawSketch(){
	let count = -1;
	let colorFgA,colorFgB,colorBg1,colorBg2;
	for(let r = 0; r < nrSquares;r++){
		for(let c = 0 ; c < nrSquares;c++){
			count ++;
			if(count%2==1){
				ColorFgA = lcolor;
				colorFgB = dcolor;
				colorBg1 = bgColor1;
				colorBg2 = bgColor2;
			}else{
				ColorFgA = dcolor;
				colorFgB = lcolor;
				colorBg1 = bgColor2;
				colorBg2 = bgColor1;
			}
			push()
				translate(r*squareSide,c*squareSide)
				drawPattern(squareSide,colorBg1,ColorFgA,colorFgB,colorBg2);
			pop()	
		}
	}
}