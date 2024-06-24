import { Color } from "./Color";
import { rand, defaultValue, defined } from "./utils";
/**
 * renderer
 */
export class Renderer {

    constructor(options = {}) {
        this.background = defined(options.background) ? options.background : new Color(0.70, 0.80, 1.00);
        this.maxDepth = defaultValue(options.maxDepth, 50);
        this.samplesPerPixel = defaultValue(options.samplesPerPixel, 10);
    }

    render(camera, hittableList) {
        const width = camera.canvasWidth, height = camera.canvasHeight;
        var pixels = new Array(width * height * 4)
        let offset = 0, ray = null;
        for (var j = height - 1; j >= 0; j--) {
            for (var i = 0; i < width; i++) {
                let colors = [];
                //multisamples per pixel
                for (let s = 0; s < this.samplesPerPixel; s++) {
                    const v = (j + rand() - 0.5) / (height - 1);
                    const u = (i + rand() - 0.5) / (width - 1);
                    ray = camera.getRay(u, v);
                    let tempColor = this.rayColor(ray, hittableList, this.maxDepth);
                    colors.push(tempColor)
                }
                let color = Color.average(colors);
                color = Color.linearToGamma(color)

                pixels[offset + 0] = color.r * 255;
                pixels[offset + 1] = color.g * 255;
                pixels[offset + 2] = color.b * 255;
                pixels[offset + 3] = 255;
                offset += 4
            }
        }
        return new ImageData(new Uint8ClampedArray(pixels), width, height)
    }


    rayColor(ray, hittableList, depth) {
        // If we've exceeded the ray bounce limit, no more light is gathered.
        if (depth <= 0)
            return new Color(0, 0, 0);

        let record = hittableList.hit(ray, 0.001, Number.POSITIVE_INFINITY);
        if (!record) {
            return this.background;
        }

        let emissionColor = record.material.emitted(record.u, record.v, record.point);

        let scatterResult = record.material.scatter(ray, record)
        if (!scatterResult) {
            return emissionColor;
        }

        let scatteredRay = scatterResult.scattered;
        let attenuationColor = scatterResult.attenuation;
        let rc = this.rayColor(scatteredRay, hittableList, depth - 1)
        let scatterColor = rc.multiply(attenuationColor);

        return emissionColor.add(scatterColor)
    }

}