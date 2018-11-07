// pixelSorting.js

var originalImage;
var sortedImage;
var cnv;
var w,h;
var selectedImage;
var selectedFunction;


function setup() {
selectedImage = "tree.png";
selectedFunction = "lightness";


var temp;
var fullPath = "images/"+ selectedImage;
    loadImage(fullPath, function(temp) {
		originalImage = temp.get();
		if(originalImage){
			w = originalImage.width;
			h = originalImage.height;
			cnv = createCanvas(w*2, h);
			cnv.parent('canvasZone');  
			process();
			setUI();
		}
		
	}, function(event) {
		console.log(event);
	});
}

 function colorTriplet(r,g,b){
	 this.r = r;
	 this.g = g;
	 this.b = b;
	 this.index =-1;
 }

function process(){
	push()
	var fct = hue;
	if(selectedFunction=="saturation"){
		fct = saturation;
	}else if(selectedFunction=="brightness"){
		fct = brightness;
	}else if(selectedFunction=="blue"){
		fct = blue;
	}else if(selectedFunction=="green"){
		fct = green;
	}else if(selectedFunction=="red"){
		fct = red;
	}else if(selectedFunction=="lightness"){
		fct = lightness;
	}
	
	background(90);
	sortedImage = originalImage.get();
	sortedImage.loadPixels();

 let colors = [];
 
for (let i = 0; i < sortedImage.pixels.length-2; i+=3) {
  let iColor = new colorTriplet(sortedImage.pixels[i],sortedImage.pixels[i+1],sortedImage.pixels[i+2]);
  iColor.index = fct(color(iColor.r,iColor.g,iColor.b));
  colors.push(iColor);
}
   
  colors.sort(function(a,b){
	return a.index - b.index;
 });  
  

colors.forEach(function(c,i){
	sortedImage.pixels[i*3] = c.r;
	sortedImage.pixels[1+(i*3)] = c.g;
	sortedImage.pixels[2+(i*3)] = c.b;
});

  sortedImage.updatePixels();
  background(0);
  image(originalImage, 0, 0);
  image(sortedImage, w, 0);
  pop();
}

function setUI(){
	var dictImg = {
		"bowie.jpg":"bowie",
		"lizard.jpg":"lizard",
		"mouse.png":"mouse",
		"sparrow.jpg":"sparrow",
		"sunflower.jpg":"sunflower",
		"tree.png":"tree",
		"wildCat.jpg":"wildCat"
	};
	makeSelect("imgChoice",dictImg,selectedImage,function(){
		selectedImage = this.value;
		reload();
	});
	
	var fnctDict = {
		"hue":"hue",
		"saturation":"saturation",
		"brightness":"brightness",
		"lightness":"lightness",
		"blue":"blue",
		"green":"green",
		"red":"red"
	};
		makeSelect("indexChoice",fnctDict,selectedFunction,function(){
		selectedFunction = this.value;
		reload();
	});
}

function reload(){
	var temp;
	background(90);
    loadImage("images/"+selectedImage, function(temp) {
		originalImage = temp.get();
		if(originalImage){
			w = originalImage.width;
			h = originalImage.height;
			resizeCanvas(w*2,h)

			process();
		}
		
	}, function(event) {
		console.log(event);
	});
}



function makeSelect(id,dictionary,selectedKey,onSelect){
	var ptr = document.getElementById(id);
	if(ptr){
		for (var key in dictionary) {
			console.log(key, dictionary[key]);
			var anOption = document.createElement("option");
			anOption.value = key;
			anOption.text = dictionary[key];
			if(selectedKey == key){
				anOption.selected = true;
			}
			ptr.appendChild(anOption);
		}
	}
	if(onSelect){
		ptr.onchange = onSelect;
	}
}

function draw() {


}