let cam;
let cam2;
let img = [];
let imagesToLoad = ['assets/nature.jpg','assets/nature2.jpg'];
let nrOfImagesToLoad = imagesToLoad.length;
let carousel;
let imagesLoaded = false;

function setup() {
	cam = new navCamera();
	cam2 = new cameraFPS();
	carousel = new Carousel();
	
	 let promises = [];
	 let nrOfImagesLoaded = 0;
	 let promise1 = new Promise(function(resolve, reject) {
			let temp;
			loadImage(imagesToLoad[0], function(temp) {
			let loadedImg = temp.get();
			if(loadedImg){
				img.push(loadedImg);
				resolve();
			}
		});
	
	});
	
	let promise2 = new Promise(function(resolve, reject) {
			let temp;
			loadImage(imagesToLoad[1], function(temp) {
			let loadedImg = temp.get();
			if(loadedImg){
				img.push(loadedImg);
				resolve();
			}
		});
	
	});
	
	Promise.all([promise1, promise2]).then(function(values) {
		createCanvas(windowWidth, windowHeight, WEBGL);

		imagesLoaded = true;
	});

}

function draw() {
	if(imagesLoaded){
	background(200);
		//cam.update();
	  cam2.draw();
	  carousel.update();
	}
}

function Carousel() {
  // setup 8 boxes in a caraousel

  this.total = 4;
  this.radius = 200;

  this.update = function() {
    this.centerX = 0;
    this.centerY = 0;
    for ( let i = 0; i < this.total; i++) {
       let x = (Math.cos(i / this.total * TWO_PI) * this.radius),
          z = (Math.sin(i / this.total * TWO_PI) * this.radius),
          y = 0;

      push();
      translate(x, y, z);
      fill(100, 50, (255 / 8) * i);
      texture(img[i % 2]);
      rotateY(-QUARTER_PI * (i + 2));
      box(100, 100, 100);
      pop();
    }
  }
}

function mouseReleased() {
  cam.onMouseRelease();
}

function mousePressed() {
  cam.onMousePress();
}
