import p5 from 'p5'

import { Ship } from './ship.js'
import { Planets } from './planets.js'

const s = (p) => {

    let ship;
    let planets

    p.setup = function () {
        p.createCanvas(1000, 700);
        p.frameRate(30);
        p.restart();
    };

    p.draw = function () {
        p.update();

        p.background(100);
        p.fill(200);
        p.text(p.frameRate().toFixed(2), 10, 10)


        p.translate(p.width / 2 - ship.pos.x, p.height / 2 - ship.pos.y)
        planets.draw();
        ship.draw();


    };

    p.update = function () {
        const isCollision = ship.update();

        if (isCollision) {
            p.restart();
        }
    }


    p.restart = function () {
        planets = new Planets(p);
        ship = new Ship(p, planets);
    };

};

new p5(s);