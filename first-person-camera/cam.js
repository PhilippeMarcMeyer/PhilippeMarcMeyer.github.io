function cameraFPS() {
  this.controllable = true;

  this.speed = 3;
  this.sensitivity = 2;
  this.friction = 0.75;

  this.position = createVector(0, 0, 0);
  this.velocity = createVector(0, 0, 0);

  this.pan = 0; // titta vänster, höger
  this.tilt = 0; // up and down
  this.y = createVector(0, 1, 0);
  this.x = createVector(1, 0, 0);
  this.z = createVector(0, 0, 1);
  this.center;

  this.mouse;
  this.prevMouse;

  this.draw = function() {
    perspective(60 / 180 * PI, width/height, 0.01, 1000);

    if(!this.controllable) return;

    this.mouse = createVector(mouseX, mouseY);
    if (this.prevMouse == null) this.prevMouse = createVector(mouseX, mouseY);

    var w = windowWidth;
    var h = windowHeight;

    if (this.mouse.x < 1 && (this.mouse.x - this.prevMouse.x) < 0){
			this.mouse.x = w-2;
			this.prevMouse.x = w-2;
		}
		if (this.mouse.x > w-2 && (this.mouse.x - this.prevMouse.x) > 0){
			this.mouse.x = 2;
			this.prevMouse.x = 2;
		}

		if (this.mouse.y < 1 && (this.mouse.y - this.prevMouse.y) < 0){
			this.mouse.y = h-2;
			this.prevMouse.y = h-2;
		}

		if (this.mouse.y > h-1 && (this.mouse.y - this.prevMouse.y) > 0){
			this.mouse.y = 2;
			this.prevMouse.y = 2;
		}

    this.pan = map(this.mouse.x - this.prevMouse.x, 0, width, 0, TWO_PI) * this.sensitivity;
		this.tilt = map(this.mouse.y - this.prevMouse.y, 0, height, 0, PI) * this.sensitivity;
		this.tilt = constrain(this.tilt, -PI/2.01, PI/2.01);

    if (this.tilt == PI/2) tilt += 0.001;

    this.z = createVector(cos(this.pan), tan(this.tilt), sin(this.pan));
    this.z.normalize(this.z);
    this.x = createVector(cos(this.pan - PI/2), 0, sin(this.pan - PI/2));

    this.prevMouse = createVector(this.mouse.x, this.mouse.y);

    if (keyIsDown(65) || keyIsDown(UP_ARROW)) this.velocity.add(p5.Vector.mult(this.x, this.speed));
	if (keyIsDown(68) || keyIsDown(DOWN_ARROW )) this.velocity.sub(p5.Vector.mult(this.x, this.speed));
	if (keyIsDown(87) || keyIsDown(LEFT_ARROW)) this.velocity.add(p5.Vector.mult(this.z, this.speed));
	if (keyIsDown(83) || keyIsDown(RIGHT_ARROW)) this.velocity.sub(p5.Vector.mult(this.z, this.speed));
	if (keyIsDown(81)) this.velocity.add(p5.Vector.mult(this.y, this.speed)); //Q
	if (keyIsDown(69)) this.velocity.sub(p5.Vector.mult(this.y, this.speed)); //E

    this.velocity.mult(this.friction);
    this.position.add(this.velocity);
    //this.center = p5.Vector.add(this.position, this.z);

  camera(this.position.x, this.position.y, this.position.z);
	// camera(this.position.x, this.position.y, this.position.z,this.center.x,this.center.y,this.center.z);
    //rotateX(this.center.y);
    //rotateY(this.center.x);
    //rotateZ(this.center.z);

  }

}
