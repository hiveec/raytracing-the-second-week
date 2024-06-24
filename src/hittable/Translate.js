import { degToRad } from "../utils";
import { Hittable } from "./Hittable";
import { Ray } from "../Ray"


export class Translate extends Hittable {

    constructor(object, offset) {
        super();
        this.offset = offset
        this.object = object;
        this.bbox = object.bbox.add(offset);
    }

    hit(ray, tmin, tmax) {
        // Move the ray backwards by the offset
        let offsetRay = new Ray(ray.origin.subtract(this.offset), ray.direction)

        // Determine whether an intersection exists along the offset ray (and if so, where)
        let rec = this.object.hit(offsetRay, tmin, tmax)
        if (!rec)
            return false;

        rec.position = rec.position.add(this.offset);
        return rec

    }
}