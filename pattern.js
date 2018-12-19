let w,h,cnv,nrSquares,squareSide,lcolor,dcolor;

function setup() {
	w = 560;
	h = 560;
	nrSquares = 18;
	squareSide = h / nrSquares;
	cnv = createCanvas(w+1, h+1);
	cnv.parent('canvasZone');  
	  lcolor = color(34,103,125)
	  dcolor = color(19,57,70)
}

function draw() {
  background(255);
  drawGrid();
  drawMainPattern();

}

function drawGrid(){
	rect(0, 0, w, h);
	/*for(let i = 1 ; i <= nrSquares;i++){
		line(0,squareSide*i,w,squareSide*i);
	}*/
}

function drawMainPattern(){
	let bigTile = squareSide * 2;
	let count = -1;
	for(let r = 0; r < bigTile*2;r++){
		for(let c = 0 ; c < bigTile;c++){
			count ++;
			if(count%2==1){
				push()
					translate(r*bigTile,(c-1)*squareSide)
					fill(lcolor)
					stroke(lcolor)
					triangle(squareSide,squareSide,0,bigTile,bigTile,bigTile)
				pop()	
			}else{
				push()
					translate(r*bigTile,c*squareSide)
					fill(lcolor)
					stroke(lcolor)
					triangle(0,0,bigTile,0,squareSide,squareSide)
				pop()
				if(r==0){
					push()
						translate(r*bigTile-squareSide,(c+1)*squareSide)
						fill(dcolor)
						stroke(dcolor)
						quad(squareSide,0,bigTile,0,squareSide,squareSide,0,squareSide)
					pop()
				}
				push()
					translate(r*bigTile+squareSide,c*squareSide)
					fill(dcolor)
					stroke(dcolor)
					quad(squareSide,0,bigTile,0,squareSide,squareSide,0,squareSide)
				pop()

			}
		}
		
	}
}