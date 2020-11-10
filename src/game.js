
import { Ship } from './ship.js'
import { Planets } from './planets.js'

export class Game {

    constructor(p) {
        this.p = p;
        this.restart();
    }


    restart() {
        this.planets = new Planets(this.p);
        this.ship = new Ship(this.p, this.planets);
    }


    update() {
        const isCollision = this.ship.update();

        if (isCollision) {
            this.restart();
        }
    }


    draw() {
        this.p.background(100);
        this.p.fill(200);
        this.p.text(this.p.frameRate().toFixed(2), 10, 10)


        this.p.translate(this.p.width / 2 - this.ship.pos.x, this.p.height / 2 - this.ship.pos.y)
        this.planets.draw();
        this.ship.draw();
    }

}