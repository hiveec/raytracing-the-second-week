/**
 * ray-object intersect record
 */
export class HitRecord {
    constructor(position, normal, t) {
        this.position = position;
        this.normal = normal;
        this.t = t;
        this.frontFace = false
        this.material = null;   //geometry material
        this.u = null;     //texture coordinate
        this.v = null;     //texture coordinate

    }

    setFaceNormal(ray, outwardNormal) {
        this.frontFace = ray.direction.dot(outwardNormal) < 0;
        this.normal = this.frontFace ? outwardNormal : outwardNormal.negate();
    }
}