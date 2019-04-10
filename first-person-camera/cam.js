function cameraFPS() {
  this.controllable = true;
  this.xRotation = 0;
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

    if (keyIsDown(65) || keyIsDown(UP_ARROW)) this.velocity.add(p5.Vector.mult(this.x, this.speed));
	if (keyIsDown(68) || keyIsDown(DOWN_ARROW )) this.velocity.sub(p5.Vector.mult(this.x, this.speed));
	if (keyIsDown(87) || keyIsDown(LEFT_ARROW)) this.xRotation += 30;//this.velocity.add(p5.Vector.mult(this.z, this.speed));
	if (keyIsDown(83) || keyIsDown(RIGHT_ARROW)) this.xRotation -= 30; //this.velocity.sub(p5.Vector.mult(this.z, this.speed));
	if (keyIsDown(81)) this.velocity.add(p5.Vector.mult(this.y, this.speed)); //Q
	if (keyIsDown(69)) this.velocity.sub(p5.Vector.mult(this.y, this.speed)); //E

    this.velocity.mult(this.friction);
    this.position.add(this.velocity);
	
   translate(0, 0, 1000);
   rotateY(-PI/2 + (PI)  * (this.xRotation / w));
   camera(this.position.x, this.position.y, this.position.z);

  }

}
