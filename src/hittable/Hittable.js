
/**
 * hittable object 
 * @abstract
 */
export class Hittable {

    constructor() {
        this.bbox = null;
    }

    /**
     * @param {Ray} ray 
     * @param {number} tmin 
     * @param {number} tmax 
     * @returns {HitRecord}
     */
    hit(ray, tmin, tmax) { }

}