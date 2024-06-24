import { Interval } from "../Interval";

export class AABB {
    constructor(intervalX, intervalY, intervalZ) {
        this.x = intervalX;
        this.y = intervalY;
        this.z = intervalZ;
        this.padToMinimums()
    }

    static fromBox(b1, b2) {
        return new AABB(
            Interval.fromIntervals(b1.x, b2.x),
            Interval.fromIntervals(b1.y, b2.y),
            Interval.fromIntervals(b1.z, b2.z)
        );
    }

    static fromPoints(p1, p2) {
        let x = (p1.x <= p2.x) ? new Interval(p1.x, p2.x) : new Interval(p2.x, p1.x);
        let y = (p1.y <= p2.y) ? new Interval(p1.y, p2.y) : new Interval(p2.y, p1.y);
        let z = (p1.z <= p2.z) ? new Interval(p1.z, p2.z) : new Interval(p2.z, p1.z);
        return new AABB(x, y, z)
    }

    padToMinimums() {
        // Adjust the AABB so that no side is narrower than some delta, padding if necessary.
        let delta = 0.0001;
        if (this.x.size() < delta) this.x = this.x.expand(delta);
        if (this.y.size() < delta) this.y = this.y.expand(delta);
        if (this.z.size() < delta) this.z = this.z.expand(delta);
        return this
    }

    axisInterval(n) {
        if (n == 1) return this.y;
        if (n == 2) return this.z;
        return this.x;
    }

    longestAxis() {
        let x = this.x.size();
        let y = this.y.size();
        let z = this.z.size();
        if (x >= y && x >= z) return 1;
        if (y >= x && y >= z) return 2;
        return 3;
    }

    add(offset) {
        return new AABB(
            new Interval(this.x.min + offset.x, this.x.max + offset.x),
            new Interval(this.y.min + offset.y, this.y.max + offset.y),
            new Interval(this.z.min + offset.z, this.z.max + offset.z)
        );
    }

    hit(ray, tmin, tmax) {
        let origin = ray.origin;
        let direction = ray.direction;

        for (let i = 0; i < 3; i++) {
            const ax = this.axisInterval(i);
            const adinv = 1.0 / direction.getValue(i);

            let t0 = (ax.min - origin.getValue(i)) * adinv;
            let t1 = (ax.max - origin.getValue(i)) * adinv;

            if (t0 < t1) {
                if (t0 > tmin) tmin = t0;
                if (t1 < tmax) tmax = t1;
            } else {
                if (t1 > tmin) tmin = t1;
                if (t0 < tmax) tmax = t0;
            }

            if (tmax <= tmin)
                return false;
        }
        return true

    }

}