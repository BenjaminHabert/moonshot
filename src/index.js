import p5 from 'p5'

import { Ship } from './ship.js'
import { Planets } from './planets.js'

const s = (p) => {

    let ship;
    let planets

    p.setup = function () {
        p.createCanvas(1000, 700);
        p.frameRate(30);
        planets = new Planets(p);
        ship = new Ship(p, planets);
    };

    p.draw = function () {
        ship.update();

        p.background(100);
        planets.draw();
        ship.draw();

        p.fill(200);
        p.text(p.frameRate().toFixed(2), 10, 10)
    };

};

new p5(s);