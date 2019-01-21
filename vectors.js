/*
Philippe MEYER 
DATE : 2019-01-16
*/

var globals = {
    mainHeight: 480,
    mainWidth: 800,
    mode: "P2D",
    moverNr: 12,
    movers: [],
    wind: null,
    gravity: null,
    airFrictionCoeff: 0.05,
    waterImpact: 3,
    waterFrictionCoeff: 0.5,
    waterLevel: 230,
    allSizes: 0,
    lastIndex: 0,
    minMass: 3,
    maxMass: 6,
    ballResizer: 7,
    lastWidth: 800,
    fillColors: [
		{ r: 91, g: 206, b: 250 },
		{ r: 245, g: 169, b: 184 },
		{ r: 206, g: 250, b: 91 },
		{ r: 184, g: 245, b: 169 },
		{ r: 206, g: 91, b: 250 },
		{ r: 169, g: 245, b: 184 }
    ]
};

function setup() {
    frameRate(30);
    globals.mainHeight = windowHeight - 20;
    globals.mainWidth = windowWidth - 20;
    globals.lastWidth = globals.mainWidth;
    globals.ballResizer = floor(globals.mainWidth / 64);
    var mode = (globals.mode == "WEBGL") ? WEBGL : P2D;
    var cnv = createCanvas(globals.mainWidth, globals.mainHeight, mode);
    cnv.parent('canvasZone');
    for (var i = 0; i < globals.moverNr; i++) {
        if (globals.allSizes + (globals.maxMass * globals.ballResizer * 3) < width) {
            globals.movers.push(new Mover(i))
        } else {
            globals.moverNr = globals.lastIndex + 1;
        }
    }
    globals.wind = createVector(random(-1, 1) / 4, random(-1, 1) / 25);
    globals.gravity = createVector(0, 0.3);
}

function draw() {
	let mx = mouseX;
	let my = mouseY;
    background(163, 214, 231);
	drawWeed1();
	drawWeed2();
    for (var i = 0; i < globals.moverNr; i++) {
        let g = p5.Vector.mult(globals.gravity, globals.movers[i].mass);
        globals.movers[i].applyForce(g);

        let friction = createVector(globals.movers[i].velocity.x, globals.movers[i].velocity.y);
        friction.normalize();
        friction.mult(-1);

        if (globals.movers[i].position.y < height - globals.waterLevel) {
            friction.mult(globals.airFrictionCoeff);
            globals.movers[i].applyForce(globals.wind);
        } else {
            if (!globals.movers[i].waterTouched) {
                globals.movers[i].velocity.y /= globals.waterImpact;
            }
            let deepnessCoeff = globals.waterFrictionCoeff;
            friction.mult(deepnessCoeff);
            if (globals.movers[i].position.y < height - 15)
                if (frameCount % 2 == 0 && globals.movers[i].position.y < height - globals.movers[i].size)
                    globals.movers[i].position.x += random(-2, 2);

            globals.movers[i].waterTouched = true;
        }
        globals.movers[i].applyForce(friction);

        globals.movers[i].update();

        let me = globals.movers[i].position;
        let meSize = globals.movers[i].size;
        for (var j = 0; j < globals.moverNr; j++) {
            if (i != j) {
                let another = globals.movers[j].position;
                let anotherSize = globals.movers[j].size;

                if (collideCircleCircle(me.x, me.y, meSize, another.x, another.y, anotherSize)) {
                    let diffx = another.x - me.x;
                    let diffy = another.y - me.y;

                    if (abs(diffx) < ((meSize + anotherSize) / 2) - 3) {

                        me.x -= anotherSize / 2 * (me.x < another.x);
                        another.x += meSize / 2 * (me.x < another.x);
                    }
                }
            }
        }
        globals.movers[i].display(mx,my);

        globals.movers[i].checkEdges();
    }

    fill(105, 210, 222,90);
    stroke(105, 210, 222,90);
    rect(0, height - globals.waterLevel, width, height);
    stroke(0);
    drawArrow(100, 100, 100 + globals.wind.x * 500, 100 + globals.wind.y * 500);

}

// Force = Mass * acceleration
// Acc = F / Mass
// if Mass == 1 then Acc == F

let Mover = function (i) {
    this.index = i;
    this.waterTouched = false;
    this.mass = floor(random(globals.minMass, globals.maxMass));
    this.position = createVector(random(width), 0)
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.size = floor(this.mass * globals.ballResizer);
    globals.allSizes += this.size + 2;
    globals.lastIndex = i;
    let index = this.index % globals.fillColors.length;
    this.color = color(globals.fillColors[index].r, globals.fillColors[index].g, globals.fillColors[index].b);

    this.update = function () {

        this.velocity.add(this.acceleration);
		if(this.waterTouched )
			this.velocity.limit(5);
		else
			this.velocity.limit(30);

        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
    this.applyForce = function (force) { // Newton's 2nd law !
        let myMass = this.waterTouched ? this.mass * 2 : this.mass;
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }
    this.checkEdges = function () {
        if (this.position.x > width) {
            this.position.x = width - this.size / 2;
            this.velocity.x *= -1.5;

        } else if (this.position.x < 0) {
            this.velocity.x *= -1.5;
            this.position.x = this.size / 2;
        }
        if (this.position.y > height - this.size / 2) {
            this.velocity.y *= -1;
            this.position.y = height - this.size / 2;
        }

    }

    this.display = function (mx,my) {
		push();
        stroke(0);
		//noStroke();
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.size, this.size);
		let angle = atan2(my - this.position.y, mx - this.position.x);
		let cos2Pointer = cos(angle);
		let sin2pointer = sin(angle);
		let irisSize =  this.size / 3;
		let irisX = this.position.x + (cos2Pointer * irisSize);
		let irisY = this.position.y + (sin2pointer * irisSize);
		let pupilSize =  irisSize / 3;
		let pupilX = irisX + (cos2Pointer * pupilSize);
		let pupilY = irisY + (sin2pointer * pupilSize);
		fill(255);
		ellipse(irisX, irisY, irisSize, irisSize);
		fill(0);
		ellipse(pupilX, pupilY, pupilSize, pupilSize);
		pop();
    }
}

function mousePressed() {
    for (var i = 0; i < globals.moverNr; i++) {
        globals.movers[i].position.y = 0;
        globals.movers[i].position.x = random(width);
        globals.movers[i].waterTouched = false;
    }
    globals.wind.x = random(-1, 1) / 10;
    globals.wind.y = random(-1, 1) / 25;
}

function calcAngleDegrees(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
}

function calcAngleRadians(x, y) {
    return Math.atan2(y, x);
}

function toradians(degrees) {
    return degrees * Math.PI / 180;
}

function keepWithInCircle(rotation) {
    const k360degres = toradians(360);
    if (rotation < 0) rotation += k360degres;
    if (rotation > k360degres) rotation -= k360degres;
    return rotation;
}

function drawWeed1(){
	let correct = height-300;
	push();
	fill(50, 200, 50);
	stroke(50, 160, 50);
	
	curve(250,63+correct,370,86+correct,302,294+correct,185,186+correct);
	curve(483,169+correct,370,86+correct,302,294+correct,231,234+correct);
	curve(82,210+correct,210,96+correct,302,294+correct,96,285+correct);
	curve(337,109+correct,210,96+correct,302,294+correct,96,285+correct);
	curve(213,96+correct,451,149+correct,302,294+correct,96,285+correct);
	bezier(86,188+correct,337,109+correct,96,285+correct,302,294+correct);
	bezier(86,188+correct,213,96+correct,96,285+correct,302,294+correct);
	
	

		pop();
}

function drawWeed2(){
	let correct = height-300;
	push();
	fill(30, 120, 70);
	stroke(50, 160, 50);
	

	translate(width-550,0);
	
	curve(250,63+correct,370,86+correct,302,294+correct,185,186+correct);
	curve(483,169+correct,370,86+correct,302,294+correct,231,234+correct);
	curve(82,210+correct,210,96+correct,302,294+correct,96,285+correct);
	curve(337,109+correct,210,96+correct,302,294+correct,96,285+correct);
	curve(469,571+correct,460,193+correct,302,294+correct,160,330+correct);
	curve(105,297+correct,460,193+correct,302,294+correct,160,330+correct);
	curve(338,83+correct,159,155+correct,302,294+correct,382,177+correct);
	curve(152,65+correct,159,155+correct,302,294+correct,127,324+correct);
	bezier(105,197+correct,152,65+correct,127,324+correct,302,294+correct);
	bezier(105,197+correct,152,133+correct,127,324+correct,302,294+correct);
		pop();
}
function drawArrow(x1, y1, x2, y2) {
    const k45degres = toradians(45);
    var branchLength = 10;
    var diffX = x2 - x1;
    var diffY = y1 - y2;
    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    if (dist != 0) {
        branchLength = min(Math.floor(dist / 3),90);
        diffX = diffX / dist;
        diffY = diffY / dist;
        // calculation angle given 2 points, just to practise : don't use cam rotation !
        var rotation = calcAngleRadians(diffX, diffY);
        var leftBranch = keepWithInCircle(rotation + k45degres);
        var rightBranch = keepWithInCircle(rotation - k45degres);
		point(x1, y1);
		ellipse(x1, y1,4);
        line(x1, y1, x2, y2);
        line(x2, y2, x2 - Math.cos(leftBranch) * branchLength, y2 + Math.sin(leftBranch) * branchLength);
        line(x2, y2, x2 - Math.cos(rightBranch) * branchLength, y2 + Math.sin(rightBranch) * branchLength);

    }
}

function windowResized() {
    globals.mainWidth = windowWidth - 20;
	globals.mainHeight  = windowHeight -20;
	//globals.waterLevel = globals.mainHeight / 3;
    resizeCanvas(windowWidth - 20, windowHeight - 20);
    globals.ballResizer = floor(globals.mainWidth / 64);
    let coeff = windowWidth / globals.lastWidth;
    for (var i = 0; i < globals.moverNr; i++) {
        globals.movers[i].size = globals.movers[i].mass * globals.ballResizer;

    }
    globals.lastWidth = width;
}