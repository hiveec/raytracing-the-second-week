import { Material } from "./Material";
import { Ray } from "../Ray";
import { Vec3 } from "../Vec3";

export class Isotropic extends Material {

    constructor(texture) {
        super();
        this.texture = texture;
    }
    
    scatter(ray, hitRecord) {
        return {
            scattered: new Ray(hitRecord.position, Vec3.randInUnit()),
            attenuation: this.texture.value(hitRecord.u, hitRecord.v, hitRecord.p)
        };

    }
}