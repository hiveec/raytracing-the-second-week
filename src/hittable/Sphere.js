import { HitRecord } from "./HitRecord";
import { Hittable } from "./Hittable";
import { AABB } from './AABB'
import { Vec3 } from "../Vec3";

/**
 * sphere, a hittable object
 */
export class Sphere extends Hittable {
    constructor(center, radius, material) {
        super();
        this.center = center;
        this.radius = radius;
        this.material = material;
        let offset = new Vec3(radius, radius, radius)
        this.bbox = AABB.fromPoints(this.center.subtract(offset), this.center.add(offset));
    }

    /**
     * @override
     */
    hit(ray, tmin, tmax) {
        let oc = this.center.subtract(ray.origin);
        let a = ray.direction.lengthSquared();
        let h = ray.direction.dot(oc);
        let c = oc.lengthSquared() - this.radius * this.radius;
        let discriminant = h * h - a * c;
        if (discriminant < 0)
            return false;

        let sqrtd = Math.sqrt(discriminant);
        let t = (h - sqrtd) / a;
        if (t < tmin || t > tmax) {
            t = (h + sqrtd) / a;
            if (t < tmin || t > tmax) {
                return false;
            }
        }

        let position = ray.at(t);
        let normal = position.subtract(this.center).scale(1 / this.radius);
        let uv = Sphere.getSphereUV(normal)

        let hit = new HitRecord(position, normal, t);
        hit.setFaceNormal(ray, normal);
        hit.material = this.material;
        hit.u = uv[0];
        hit.v = uv[1];

        return hit;
    }

    static getSphereUV(p) {
        // p: a given point on the sphere of radius one, centered at the origin.
        // u: returned value [0,1] of angle around the Y axis from X=-1.
        // v: returned value [0,1] of angle from Y=-1 to Y=+1.
        //     <1 0 0> yields <0.50 0.50>       <-1  0  0> yields <0.00 0.50>
        //     <0 1 0> yields <0.50 1.00>       < 0 -1  0> yields <0.50 0.00>
        //     <0 0 1> yields <0.25 0.50>       < 0  0 -1> yields <0.75 0.50>

        let theta = Math.acos(-p.y);
        let phi = Math.atan2(-p.z, p.x) + Math.PI;

        let u = phi / (2 * Math.PI);
        let v = theta / Math.PI;
        if (Number.isNaN(v) || Number.isNaN(u)) {
            debugger
        }

        return [u, v]
    }

}
