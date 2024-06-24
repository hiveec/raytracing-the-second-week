import { Material } from "./Material";
import { Vec3 } from "../Vec3";
import { Ray } from "../Ray";
import { Color } from "../Color";

/**
 * lambertian material
 */
export class Lambertian extends Material {
    constructor(albedo) {
        super()
        this.albedo = albedo;
    }

    scatter(ray, hitRecord) {
        let scatterDirection = hitRecord.normal.add(Vec3.randInUnit());

        if (Vec3.nearZero(scatterDirection))
            scatterDirection = hitRecord.normal;

        let attenuation;
        if (this.albedo instanceof Color) {
            //color
            attenuation = this.albedo
        } else {
            //texture
            attenuation = this.albedo.value(hitRecord.u, hitRecord.v, hitRecord.position);
        }

        return {
            scattered: new Ray(hitRecord.position, scatterDirection),
            attenuation: attenuation
        };
    }
}