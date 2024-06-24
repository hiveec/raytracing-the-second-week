import { Color } from "../Color";

/**
 * material
 * @abstract
 */
export class Material {
    constructor() { }

    /**
     * scatter from surface
     */
    scatter(ray, hitRecord) {
        return false;
    }

    /**
     * emitted light
     */
    emitted(u, v, p) {
        return new Color(0, 0, 0);
    }
}