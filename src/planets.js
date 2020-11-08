const data = {
    earth: {
        radius: 150,
        mass: 1,
        center: { x: 100, y: 100 },
        launchAngle: 0.2
    },
    moon: {
        radius: 10,
        mass: 0.1,
        center: { x: 800, y: 600 }
    },
    otherPlanets: [
        {
            radius: 20,
            mass: 0.2,
            center: { x: 500, y: 400 }
        }
    ]
}




export class Planets {
    constructor(p) {
        this.p = p;

        this.data = data;
        this.planets = data.otherPlanets;
        this.planets.push(data.earth)
        this.planets.push(data.moon)
    }


    draw() {
        this.p.ellipseMode(this.p.CENTER);
        this.p.fill(50, 10, 10);
        for (const planet of this.planets) {
            this.p.circle(planet.center.x, planet.center.y, 2 * planet.radius)
        }
    }


    getLaunchpad() {
        const earth = this.data.earth;
        const pos = this.p.createVector(earth.center.x, earth.center.y);
        const vec = this.p.createVector(earth.radius + 2, 0);
        vec.rotate(earth.launchAngle);
        pos.add(vec);
        const launchpad = {
            pos: pos.copy(),
            angle: earth.launchAngle,
            localGravity: this.computeGravityForPlanet(pos, earth)
        }
        console.log(launchpad)
        return launchpad
    }


    computeGravityAcceleration(pos) {
        let acceleration = this.p.createVector(0, 0);
        for (const planet of this.planets) {
            const gravity = this.computeGravityForPlanet(pos, planet)
            acceleration.add(gravity)
        }

        return acceleration;
    }

    computeGravityForPlanet(pos, planet) {
        const gravity = this.p.createVector(planet.center.x, planet.center.y);
        gravity.sub(pos);
        const gravityMag = 1000 * planet.mass / this.p.max(gravity.magSq(), planet.radius * planet.radius);
        gravity.setMag(gravityMag)

        return gravity
    }

}