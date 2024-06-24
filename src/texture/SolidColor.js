import { Texture } from "./Texture";

export class SolidColor extends Texture {
    constructor(color) {
        super();
        this.color = color;
    }

    value(u, v, p) {
        return this.color;
    }
}