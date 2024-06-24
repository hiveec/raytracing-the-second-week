import { degToRad } from "../utils";
import { Hittable } from "./Hittable";
import { HitRecord } from "./HitRecord";
import { Point } from "../Point";
import { Vec3 } from "../Vec3";
import { AABB } from "./AABB";
import { Ray } from "../Ray"

const infinity = Number.POSITIVE_INFINITY;
const _infinity = Number.NEGATIVE_INFINITY;

export class RotateY extends Hittable {

    constructor(object, angle) {
        super();
        let radians = degToRad(angle);
        let sin_theta = Math.sin(radians);
        let cos_theta = Math.cos(radians);
        let bbox = object.bbox;

        let min = new Point(infinity, infinity, infinity);
        let max = new Point(_infinity, _infinity, _infinity);

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {
                    let x = i * bbox.x.max + (1 - i) * bbox.x.min;
                    let y = j * bbox.y.max + (1 - j) * bbox.y.min;
                    let z = k * bbox.z.max + (1 - k) * bbox.z.min;

                    let newx = cos_theta * x + sin_theta * z;
                    let newz = -sin_theta * x + cos_theta * z;

                    let tester = new Vec3(newx, y, newz);

                    for (let c = 0; c < 3; c++) {
                        min.setValue(c, Math.min(min.getValue(c), tester.getValue(c)));
                        max.setValue(c, Math.max(max.getValue(c), tester.getValue(c)));
                    }
                }
            }
        }
        this.bbox = AABB.fromPoints(min, max);
        this.object = object;
        this.sin_theta = sin_theta
        this.cos_theta = cos_theta
    }

    hit(ray, tmin, tmax) {
        // Change the ray from world space to object space
        let origin = ray.origin.scale(1);
        let direction = ray.direction.scale(1);

        let sin_theta = this.sin_theta
        let cos_theta = this.cos_theta

        origin.x = cos_theta * ray.origin.x - sin_theta * ray.origin.z;
        origin.z = sin_theta * ray.origin.x + cos_theta * ray.origin.z;

        direction.x = cos_theta * ray.direction.x - sin_theta * ray.direction.z;
        direction.z = sin_theta * ray.direction.x + cos_theta * ray.direction.z;

        // ray rotated_r(origin, direction, r.time());
        let rotatedRay = new Ray(origin, direction)

        // Determine whether an intersection exists in object space (and if so, where)
        let rec = this.object.hit(rotatedRay, tmin, tmax)
        if (!rec)
            return false;

        // Change the intersection point from object space to world space
        let p = rec.position.scale(1);
        rec.position.x = cos_theta * p.x + sin_theta * p.z;
        rec.position.z = -sin_theta * p.x + cos_theta * p.z;

        // Change the normal from object space to world space
        let normal = rec.normal.scale(1);;
        rec.normal.x = cos_theta * normal.x + sin_theta * normal.z;
        rec.normal.z = -sin_theta * normal.x + cos_theta * normal.z;

        return rec

    }
}