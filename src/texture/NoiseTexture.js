import { rand } from "../utils";
import { PerlinNoise } from "./PerlinNoise";
import { Texture } from "./Texture";
import { Color } from "../Color";

const perline = new PerlinNoise();
const DEFAULT_COLOR = new Color(1, 1, 1)
export class NoiseTexture extends Texture {
    constructor(scale = 1) {
        super()
        this.scale = scale;
    }

    value(u, v, p) {
        return DEFAULT_COLOR.scale(perline.noise(p.scale(this.scale)));
    }

}