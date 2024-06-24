import { AABB } from "./AABB";
import { Hittable } from "./Hittable";
import { Interval } from "../Interval";
import { HitRecord } from "./HitRecord";
import { Vec3 } from '../Vec3'
import { HittableList } from "./HittableList";
import { Point } from "../Point";

const _unitInterval = new Interval(0, 1);

/**
 * quadrilateral
 */
export class Quad extends Hittable {
    constructor(point, u, v, material) {
        super()
        this.point = point;
        this.u = u;
        this.v = v;
        this.material = material;
        let n = u.cross(v);
        this.normal = n.unit()
        this.d = this.normal.dot(this.point);
        this.w = n.scale(1 / n.dot(n));
        this.setBoundingBox();
    }

    setBoundingBox() {
        let bbox1 = AABB.fromPoints(this.point, this.point.add(this.u).add(this.v));
        let bbox2 = AABB.fromPoints(this.point.add(this.u), this.point.add(this.v));
        this.bbox = AABB.fromBox(bbox1, bbox2);
    }

    hit(ray, tmin, tmax) {
        let denom = this.normal.dot(ray.direction);

        // No hit if the ray is parallel to the plane.
        if (Math.abs(denom) < 1e-8)
            return false;

        let t = (this.d - this.normal.dot(ray.origin)) / denom;
        if (t < tmin || t > tmax)
            return false;

        // Determine the hit point lies within the planar shape using its plane coordinates.
        let intersection = ray.at(t);
        let planarVector = intersection.subtract(this.point);
        let alpha = this.w.dot(planarVector.cross(this.v));
        let beta = this.w.dot(this.u.cross(planarVector));

        if (!this.isInterior(alpha, beta))
            return false;

        // Ray hits the 2D shape; set the rest of the hit record and return true.

        let hit = new HitRecord(intersection, this.normal, t);
        hit.setFaceNormal(ray, this.normal);
        hit.material = this.material;
        hit.uv = [alpha, beta];
        return hit;
    }

    isInterior(a, b) {
        // Given the hit point in plane coordinates, return false if it is outside the
        // primitive, otherwise set the hit record UV coordinates and return true.
        if (!_unitInterval.contains(a) || !_unitInterval.contains(b))
            return false;
        return true;
    }
}

export function createBox(a, b, material) {
    // Returns the 3D box (six sides) that contains the two opposite vertices a & b.

    let sides = new HittableList();

    // Construct the two opposite vertices with the minimum and maximum coordinates.
    let min = new Point(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    let max = new Point(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));

    let dx = new Vec3(max.x - min.x, 0, 0);
    let dy = new Vec3(0, max.y - min.y, 0);
    let dz = new Vec3(0, 0, max.z - min.z);

    let ndx = dx.scale(-1);
    let ndy = dy.scale(-1);
    let ndz = dz.scale(-1);

    sides.add(new Quad(new Point(min.x, min.y, max.z), dx, dy, material)); // front
    sides.add(new Quad(new Point(max.x, min.y, max.z), ndz, dy, material)); // right
    sides.add(new Quad(new Point(max.x, min.y, min.z), ndx, dy, material)); // back
    sides.add(new Quad(new Point(min.x, min.y, min.z), dz, dy, material)); // left
    sides.add(new Quad(new Point(min.x, max.y, max.z), dx, ndz, material)); // top
    sides.add(new Quad(new Point(min.x, min.y, min.z), dx, dz, material)); // bottom
    return sides;
}