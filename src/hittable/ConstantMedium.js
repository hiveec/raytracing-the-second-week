
import { Hittable } from "./Hittable";
import { rand } from "../utils";
import { HitRecord } from "./HitRecord";
import { Isotropic } from "../material/Isotropic";
import { Vec3 } from "../Vec3";

export class ConstantMedium extends Hittable {

    constructor(boundary, density, texture) {
        super();
        this.boundary = boundary;
        this.negInvDensity = -1 / density;
        this.phaseFunction = new Isotropic(texture);
        this.bbox = this.boundary.bbox
    }

    hit(ray, tmin, tmax) {

        let rec1 = this.boundary.hit(ray, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
        if (!rec1)
            return false;

        let rec2 = this.boundary.hit(ray, rec1.t + 0.0001, Number.POSITIVE_INFINITY)
        if (!rec2)
            return false;


        if (rec1.t < tmin) rec1.t = tmin;
        if (rec2.t > tmax) rec2.t = tmax;

        if (rec1.t >= rec2.t)
            return false;

        if (rec1.t < 0)
            rec1.t = 0;

        let rayLength = ray.direction.length();
        let distanceInsideBoundary = (rec2.t - rec1.t) * rayLength;
        let hitDistance = this.negInvDensity * Math.log(rand());

        if (hitDistance > distanceInsideBoundary)
            return false;

        let t = rec1.t + hitDistance / rayLength;
        let position = ray.at(t);
        let normal = new Vec3(1, 0, 0);  // arbitrary

        let hit = new HitRecord(position, normal, t);
        hit.frontFace = true;  // also arbitrary
        hit.material = this.phaseFunction;

        return hit;
    }


}