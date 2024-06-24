import { Texture } from "./Texture";

export class CheckerTexture extends Texture {
    constructor(scale, color1, color2) {
        super()
        this.invScale = 1 / scale;
        this.color1 = color1;
        this.color2 = color2;
    }

    value(u, v, p) {
        let xInteger = Math.floor(this.invScale * p.x);
        let yInteger = Math.floor(this.invScale * p.y);
        let zInteger = Math.floor(this.invScale * p.z);
        let isEven = (xInteger + yInteger + zInteger) % 2 == 0;
        return isEven ? this.color1 : this.color2;
    }
}