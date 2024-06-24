
import { Point } from './Point';
import { Vec3 } from './Vec3'
import { Ray } from './Ray';
import { degToRad } from './utils';

const _UP = new Vec3(0, 1, 0);
const _OFFSET = new Vec3(0, 0, 0);
/**
 * perspective camera
 */
export class Camera {
    constructor(canvasWidth, canvasHeight, fov = 60, focalLength = 1) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.fov = degToRad(fov);
        this.focalLength = focalLength;

        this.position = new Point(0, 0, 0)
        this.target = new Point(0, 0, -1)

        this.horizontal = new Vec3(0, 0, 0);
        this.vertical = new Vec3(0, 0, 0);
        this.lowerLeftCorner = new Point(0, 0, 0)

        this.samplesPerPixel = 10;
        this.dirty = true;
    }

    lookAt(position, target) {
        position && (this.position = position);
        target && (this.target = target);
        this.dirty = true;
    }

    update() {
        if (!this.dirty) return;
        this.dirty = false;

        let aspect = this.canvasWidth / this.canvasHeight;
        let viewportHeight = 2 * Math.tan(0.5 * this.fov) * this.focalLength;
        let viewportWidth = viewportHeight * aspect;

        //directions
        let forward = this.position.subtract(this.target).unit();
        let right = _UP.cross(forward).unit();
        let up = forward.cross(right).unit();
        //
        this.horizontal = right.scale(viewportWidth);
        this.vertical = up.scale(viewportHeight);
        this.lowerLeftCorner = this.position
            .subtract(this.horizontal.scale(0.5))
            .subtract(this.vertical.scale(0.5))
            .subtract(forward.scale(this.focalLength));
    }

    getRay(u, v) {
        this.update();
        let offset = _OFFSET;

        let direction = this.lowerLeftCorner
            .add(this.horizontal.scale(u))
            .add(this.vertical.scale(v))
            .subtract(this.position);

        return new Ray(this.position, direction);
    }

}