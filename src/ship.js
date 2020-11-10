import { ShipConstants } from './constants';

export class Ship {
    hasLiftOff = false;
    boosterOn = false;
    boosterJettisoned = false;
    engineOn = false;

    constructor(p, planets) {
        this.p = p;
        this.attachEvents(p);


        this.planets = planets;


        this.velocity = this.p.createVector(0, 0);
        const start = this.planets.getLaunchpad();
        this.pos = start.pos;
        this.angle = start.angle;
        this.boosterStrength = start.localGravity.mag() * (1 + ShipConstants.boosterForce);

    }

    update() {
        this.registerCommands();
        let isCollision = false
        if (this.hasLiftOff) {
            isCollision = this.move();
        }

        return isCollision
    }

    registerCommands() {
        if (this.p.keyIsDown(this.p.LEFT_ARROW)) {
            this.angle -= ShipConstants.angleChange;
        }
        if (this.p.keyIsDown(this.p.RIGHT_ARROW)) {
            this.angle += ShipConstants.angleChange;
        }
        this.engineOn = this.p.keyIsDown(this.p.UP_ARROW);

    }

    reachedTheMoon() {
        return this.planets.reachedTheMoon(this.pos);
    }

    move() {
        let acceleration = this.computeSelfAcceleration();
        const { gravity } = this.planets.computeGravityAcceleration(this.pos)
        acceleration.add(gravity);
        this.velocity.add(acceleration);
        this.pos.add(this.velocity);

        const { isCollision } = this.planets.computeGravityAcceleration(this.pos)
        return isCollision;
    }

    computeSelfAcceleration() {
        let direction = this.p.createVector(1, 0);
        direction.rotate(this.angle);

        let acceleration = this.p.createVector(0, 0),
            accEngine = this.p.createVector(0, 0),
            accBooster = this.p.createVector(0, 0);

        if (this.engineOn) {
            accEngine.add(direction);
            accEngine.mult(ShipConstants.engineForce);
        }
        if (this.boosterOn) {
            accBooster.add(direction);
            accBooster.mult(this.boosterStrength);
        }

        acceleration.add(accEngine);
        acceleration.add(accBooster);

        return acceleration
    }


    computeNextPositions() {
        let positions = [];
        let pos = this.pos.copy();
        let velocity = this.velocity.copy();
        for (let i = 0; i < ShipConstants.numPredicted; i++) {
            const { gravity, isCollision } = this.planets.computeGravityAcceleration(pos);
            velocity.add(gravity);
            pos.add(velocity);
            positions.push(pos.copy());
            if (isCollision) {
                break;
            }
        }

        return positions
    }


    draw() {
        if (this.hasLiftOff) {
            const positions = this.computeNextPositions();
            this.p.fill(0, 0, 200);
            for (let pos of positions) {
                this.p.ellipse(pos.x, pos.y, 3, 3);
            }
        }


        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        this.p.rotate(this.angle);
        this.p.rectMode(this.p.CENTER);

        this.p.fill(255, 100, 100);
        this.p.rect(0, 0, 20, 10);
        this.p.line(0, 0, 30, 0);

        if (this.engineOn) {
            this.p.fill(255, 255, 100)
            this.p.ellipse(-15, 0, 10, 10)
        }

        if (!this.boosterJettisoned) {
            this.p.fill(100, 255, 100);
            this.p.rect(-5, 10, 10, 5);
            this.p.rect(-5, -10, 10, 5);
            if (this.boosterOn) {
                this.p.fill(255, 255, 100);
                this.p.ellipse(-15, 10, 15, 10);
                this.p.ellipse(-15, -10, 15, 10);
            }
        }

        this.p.pop();
    }

    keyPressed() {
        if (this.p.keyCode === ShipConstants.keyCodeBooster) {
            if (this.boosterOn === false) {
                if (this.boosterJettisoned === false) {
                    this.boosterOn = true;
                    this.hasLiftOff = true;
                }
            }
            else {
                this.boosterOn = false;
                this.boosterJettisoned = true;
            }
            return false;
        }
    }

    attachEvents(p) {
        p.keyPressed = this.keyPressed.bind(this);
    }
}