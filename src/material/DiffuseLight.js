import { Material } from "./Material";

/**
 * light
 */
export class DiffuseLight extends Material {
    constructor(texture) {
        super();
        this.texture = texture;
    }

    emitted(u, v, p) {
        return this.texture.value(u, v, p);
    }
}