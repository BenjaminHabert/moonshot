import p5 from 'p5'

import { CanvasConstants } from "./constants.js"

import { Game } from "./game.js"

const s = (p) => {


    let game;

    p.setup = function () {
        p.createCanvas(CanvasConstants.width, CanvasConstants.height);
        p.frameRate(CanvasConstants.frameRate);
        game = new Game(p);
    };

    p.draw = function () {
        game.update();
        game.draw();
    };

};

new p5(s);