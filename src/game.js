import axios from "axios"

import { Ship } from './ship.js'
import { Planets } from './planets.js'
import { GameConstants } from "./constants";

export class Game {

    constructor(p) {
        this.p = p;
        this.nextLevel();
    }


    nextLevel() {
        if (!this.currentLevel) {
            this.currentLevel = 1;
        }
        else {
            this.currentLevel += 1;

            if (this.currentLevel > GameConstants.maxLevel) {
                this.won = true;
            }
        }
        this.restart();
    }


    restart() {
        this.ready = false;
        if (this.won === true) {
            return;
        }
        axios.get(this.getLevelUri(this.currentLevel))
            .then(response => {
                this.planets = new Planets(this.p, response.data);
                this.ship = new Ship(this.p, this.planets);
                this.ready = true;
            })
    }


    getLevelUri(level) {
        return `levels/level_${String(level).padStart(2, "0")}.json`
    }


    update() {
        this.registerCommands();

        if (this.ready) {


            const isCollision = this.ship.update();

            if (isCollision) {
                if (this.ship.reachedTheMoon()) {
                    this.nextLevel();
                }
                else {
                    this.restart();
                }
            }
        }
    }


    registerCommands() {
        if (this.p.keyIsDown(this.p.ENTER)) {
            this.restart();
        }
    }

    getBackgroundColor() {
        if (!this.ready) {
            return GameConstants.colorFar;
        }
        else {
            let { earth, moon } = this.planets.data;
            earth = this.p.createVector(earth.center.x, earth.center.y);
            moon = this.p.createVector(moon.center.x, moon.center.y);
            let ship = this.ship.pos;

            let distEarthMoon = earth.copy().sub(moon).mag(),
                distShipMoon = ship.copy().sub(moon).mag();
            const ratio = this.p.constrain(distShipMoon / (distEarthMoon / 2.0), 0, 1);
            return this.p.lerpColor(this.p.color(GameConstants.colorClose), this.p.color(GameConstants.colorFar), ratio)
        }
    }


    draw() {
        if (this.won) {
            this.p.background(200, 100, 100);
            this.p.fill(0);
            this.p.text("WIN !", 10, 10)
            return;
        }
        if (!this.ready) {
            this.p.background(200);
            this.p.fill(50);
            this.p.text("not ready", 10, 10);
            return;
        }


        this.p.background(this.getBackgroundColor());
        this.p.fill(200);
        this.p.text(this.p.frameRate().toFixed(2), 10, 10)

        this.p.translate(this.p.width / 2 - this.ship.pos.x, this.p.height / 2 - this.ship.pos.y)
        this.planets.draw();
        this.ship.draw();
    }


}