import { rand, randInt } from "../utils";

const POINT_COUNT = 256;

export class PerlinNoise {

    constructor() {
        this.randfloat = new Array(POINT_COUNT);
        for (let i = 0; i < POINT_COUNT; i++) {
            this.randfloat[i] = rand();
        }

        this.permX = PerlinNoise.perlinGeneratePerm();
        this.permY = PerlinNoise.perlinGeneratePerm();
        this.permZ = PerlinNoise.perlinGeneratePerm();
    }

    noise(p) {
        let u = p.x - Math.floor(p.x);
        let v = p.y - Math.floor(p.y);
        let w = p.z - Math.floor(p.z);
        u = u * u * (3 - 2 * u);
        v = v * v * (3 - 2 * v);
        w = w * w * (3 - 2 * w);

        let i = parseInt(Math.floor(p.x));
        let j = parseInt(Math.floor(p.y));
        let k = parseInt(Math.floor(p.z));

        let c = []
        for (let di = 0; di < 2; di++) {
            for (let dj = 0; dj < 2; dj++) {
                for (let dk = 0; dk < 2; dk++) {
                    if (c[di] == undefined) c[di] = [];
                    if (c[di][dj] == undefined) c[di][dj] = [];
                    c[di][dj][dk] = this.randfloat[
                        this.permX[(i + di) & 255] ^
                        this.permY[(j + dj) & 255] ^
                        this.permZ[(k + dk) & 255]
                    ];
                }
            }
        }
        return PerlinNoise.trilinearInterp(c, u, v, w);
    }

    static trilinearInterp(c, u, v, w) {
        let accum = 0.0;
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                for (let k = 0; k < 2; k++)
                    accum += (i * u + (1 - i) * (1 - u))
                        * (j * v + (1 - j) * (1 - v))
                        * (k * w + (1 - k) * (1 - w))
                        * c[i][j][k];

        return accum;
    }


    static perlinGeneratePerm() {
        let p = new Array(POINT_COUNT);
        for (let i = 0; i < POINT_COUNT; i++) {
            p[i] = i;
        }
        PerlinNoise.permute(p, POINT_COUNT);
        return p;
    }

    static permute(p, n) {
        for (let i = n - 1; i > 0; i--) {
            let target = randInt(0, i);
            let tmp = p[i];
            p[i] = p[target];
            p[target] = tmp;
        }
        return p;
    }

}