import { AABB } from "./AABB";
import { Hittable } from "./Hittable"
import { randInt } from "../utils";

function box_compare_less(a, b, axis) {
    let a_axis_interval = a.bbox.axisInterval(axis);
    let b_axis_interval = b.bbox.axisInterval(axis);
    return a_axis_interval.min < b_axis_interval.min;
}

function box_x_compare_less(a, b) {
    return box_compare_less(a, b, 0)
}

function box_y_compare_less(a, b) {
    return box_compare_less(a, b, 1)
}

function box_z_compare_less(a, b) {
    return box_compare_less(a, b, 2)

}

/**
 * bvh node
 */
export class BvhNode extends Hittable {
    constructor(objects = []) {
        super()
        this.left = null;
        this.right = null;
        this.bbox = null;
        this.splitBVH(objects)
    }

    splitBVH(objects = []) {
        let bbox = objects[0].bbox;
        for (let i = 0; i < objects.length; i++) {
            bbox = AABB.fromBox(bbox, objects[i].bbox);
        }
        let axis = bbox.longestAxis()

        // let axis = randInt(0, 2);

        let comparator =
            (axis == 0) ?
                box_x_compare_less
                : (axis == 1) ? box_y_compare_less
                    : box_z_compare_less;

        let object_span = objects.length;

        if (object_span == 1) {
            this.left = objects[0];
            this.right = objects[0];
            this.bbox = objects[0].bbox;
        } else {
            objects.sort(comparator);
            let mid = 0.5 * object_span;
            this.left = new BvhNode(objects.slice(0, mid));
            this.right = new BvhNode(objects.slice(mid, object_span));
            this.bbox = AABB.fromBox(this.left.bbox, this.right.bbox);
        }
    }

    hit(ray, tmin, tmax) {
        if (!this.bbox.hit(ray, tmin, tmax)) {
            return false
        }
        let hitLeft = this.left.hit(ray, tmin, tmax)
        let hitRight = this.right.hit(ray, tmin, tmax)
        return hitLeft || hitRight
    }
}