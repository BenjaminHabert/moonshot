import axios from "axios"

import { Ship } from './ship.js'
import { Planets } from './planets.js'

export class Game {

    constructor(p) {
        this.p = p;
        this.restart();
    }


    restart() {
        this.ready = false;
        axios.get('/levels/level_01.json')
            .then(response => {
                this.planets = new Planets(this.p, response.data);
                this.ship = new Ship(this.p, this.planets);
                this.ready = true;
            })
    }


    update() {
        if (this.ready) {
            const isCollision = this.ship.update();

            if (isCollision) {
                this.restart();
            }
        }
    }


    draw() {


        if (!this.ready) {
            this.p.background(200);
            this.p.fill(50);
            this.p.text("not ready", 10, 10);
            return;
        }


        this.p.background(100);
        this.p.fill(200);
        this.p.text(this.p.frameRate().toFixed(2), 10, 10)

        this.p.translate(this.p.width / 2 - this.ship.pos.x, this.p.height / 2 - this.ship.pos.y)
        this.planets.draw();
        this.ship.draw();
    }

}