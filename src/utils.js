
/**
 * utils 
 */


export const degree = 0.01745329251994329577;   //Math.PI / 180;
export const radian = 57.29577951308232088;     //180 / Math.PI;
export const EPSILON = 1e-8;

/**
 * whether the property is defined
 */
export function defined(a) {
    return a != undefined && a != null;
}
/**
 * return a default value for property invalid
 */
export function defaultValue(a, b) {
    if (a !== undefined && a != null) {
        return a
    }
    return b;
}
/**
 * degree to radian
 */
export function degToRad(a) {
    return a * degree;
}

/**
 * radian to degree
 */
export function radToDeg(a) {
    return a * radian;
}

/**
 * random double number
 */
export function rand(min = 0, max = 1) {
    return min + (max - min) * Math.random();
}

/**
 * random integer number
 */
export function randInt(min = 0, max = 1) {
    return Math.floor(rand(min, max + 1));
}

/**
 * clamp
 */
export function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}