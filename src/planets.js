import { PlanetsConstants } from "./constants"


export class Planets {
    constructor(p, data) {
        this.p = p;

        this.data = data;
        this.planets = this.data.otherPlanets;
        this.planets.push(this.data.earth)
        this.planets.push(this.data.moon)
    }


    draw() {
        this.p.ellipseMode(this.p.CENTER);
        for (const planet of this.planets) {
            this.p.fill(planet.color);
            this.p.circle(planet.center.x, planet.center.y, 2 * planet.radius)
        }
    }


    getLaunchpad() {
        const earth = this.data.earth;
        const pos = this.p.createVector(earth.center.x, earth.center.y);
        const vec = this.p.createVector(earth.radius + PlanetsConstants.launchpadDelta, 0);
        vec.rotate(earth.launchAngle);
        pos.add(vec);

        const { planetGravity } = this.computeGravityForPlanet(pos, earth);
        const launchpad = {
            pos: pos.copy(),
            angle: earth.launchAngle,
            localGravity: planetGravity
        }
        return launchpad
    }


    computeGravityAcceleration(pos) {
        let gravity = this.p.createVector(0, 0);
        let isCollision = false;
        for (const planet of this.planets) {
            const { planetGravity, collides } = this.computeGravityForPlanet(pos, planet)
            isCollision = isCollision || collides;
            gravity.add(planetGravity)
        }

        return { gravity, isCollision };
    }

    computeGravityForPlanet(pos, planet) {
        const radiusSq = planet.radius * planet.radius;

        const toPlanet = this.p.createVector(planet.center.x, planet.center.y);
        toPlanet.sub(pos);
        const distSq = toPlanet.magSq();
        const gravityMag = PlanetsConstants.gravity * planet.mass / this.p.max(distSq, radiusSq);

        const planetGravity = toPlanet.copy()
        planetGravity.setMag(gravityMag)

        const collides = radiusSq > distSq;

        return { planetGravity, collides }
    }

    reachedTheMoon(pos) {
        const toMoon = this.p.createVector(this.data.moon.center.x, this.data.moon.center.y);
        toMoon.sub(pos);

        return toMoon.mag() < this.data.moon.radius;
    }

}