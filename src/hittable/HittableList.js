import { AABB } from "./AABB";
import { Hittable } from "./Hittable";

/**
 * list of hittable objects
 */
export class HittableList extends Hittable {

    constructor(objects = []) {
        super()
        this.objects = objects;
        this.dirty = true;
    }

    add(object) {
        this.objects.push(object)
        if (!this.bbox) {
            this.bbox = object.bbox;
        } else {
            this.bbox = AABB.fromBox(this.bbox, object.bbox);
        }
    }

    hit(ray, tmin, tmax) {
        let record = null, hitted = false, closest = tmax
        for (let i = 0; i < this.objects.length; i++) {
            let hit = this.objects[i].hit(ray, tmin, closest)
            if (!hit) continue
            hitted = true, closest = hit.t, record = hit;
        }
        return record
    }
}