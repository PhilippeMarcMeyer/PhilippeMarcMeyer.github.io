function navCamera() {
  //Camera position and rotation
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.xRotation = 0;
  this.yRotation = 0;

  //Properties for rotating camera with mouse
  this.lastMouseX = width / 2;
  this.lastMouseY = height / 2;
  this.beganMouseY = 0;
  this.beganMouseX = 0;

  this.update = function() {
    this.checkInput();

    //camera(this.x, this.y, this.z);
    //translate(-this.x, -this.y, -this.z)

    translate(0, 0, 1000);
    rotateY(-PI/2 + (PI)  * (this.xRotation / width));
    //rotateX(-PI/2 + (PI)  * (this.yRotation / height));
    translate(-cam.x, -cam.y, -cam.z)
    }

  this.checkInput = function() {
    //key input
    if(keyIsDown(87)||keyIsDown(UP_ARROW)) { // W
      this.z -= 10;
    }
    if(keyIsDown(83)||keyIsDown(DOWN_ARROW)) { //S
      this.z += 10;
    }
    if(keyIsDown(65)||keyIsDown(LEFT_ARROW)) { //A
      this.x -= 10;
    }
    if(keyIsDown(68)||keyIsDown(RIGHT_ARROW)) { //D
      this.x += 10;
    }

    //Calculate mouse movement while pressed
    this.xRotation = this.lastMouseX;
    this.yRotation = this.lastMouseY;
    if (mouseIsPressed) {
      var deltaX = mouseX - this.beganMouseX;
      this.xRotation += deltaX;
      var deltaY = mouseY - this.beganMouseY;
      this.yRotation += deltaY;
    }
  }

  this.onMouseRelease = function() {
    var deltaX = mouseX - this.beganMouseX;
    var deltaY = mouseY - this.beganMouseY;
    this.lastMouseX += deltaX;
    this.lastMouseY += deltaY;
  }

  this.onMousePress = function() {
    this.beganMouseX = mouseX;
    this.beganMouseY = mouseY;
  }

}
