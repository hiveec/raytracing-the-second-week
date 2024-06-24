import { Texture } from "./Texture";
import { clamp } from "../utils";
import { Color } from "../Color";

/**
 * texture from image
 */
export class ImageTexture extends Texture {
    constructor(url) {
        super()
        this.imageData = null;
        this.url = url;
        this.load();
    }

    async load() {
        let response = await fetch(this.url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let blob = await response.blob();
        let bitmap = await createImageBitmap(blob);

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        ctx.drawImage(bitmap, 0, 0);

        this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    value(u, v, p) {
        // If we have no texture data, then return solid cyan as a debugging aid.
        if (!this.imageData) return new Color(0, 1, 1);

        u = clamp(u, 0, 1);
        v = 1.0 - clamp(v, 0, 1);

        let x = Math.floor(u * this.imageData.width);
        let y = Math.floor(v * this.imageData.height);

        // pixel index
        let index = (y * this.imageData.width + x) * 4;

        // color
        let r = this.imageData.data[index];
        let g = this.imageData.data[index + 1];
        let b = this.imageData.data[index + 2];

        let color_scale = 1.0 / 255.0;
        return new Color(color_scale * r, color_scale * g, color_scale * b);

    }

}