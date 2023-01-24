export class _vectortype {
  x = 0;
  y = 0;
}

export interface _segmenttype {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}

export const SQRT_2 = Math.sqrt(2);
export const SQRT_3 = Math.sqrt(3);
export const SQRT_5 = Math.sqrt(5);

const regpoly = function(sides: number, size: number, angle = 0, x = 0, y = 0) {
  const ans: _vectortype[] = [];
  let a = angle;
  size *= get_real_regpoly_size(sides);
  for (let i = 0; i < sides; ++i) {
    ans.push(math_util.vector_create(x + size * Math.cos(a), y + size * Math.sin(a)));
    a += Math.PI * 2 / sides;
  }
  return ans;
};

const _regpolySizes = (() => {
  const o = [1, 1, 1]; 
  for (let sides = 3; sides < 16; sides++) {
    o.push(Math.sqrt((2 * Math.PI / sides) * (1 / Math.sin(2 * Math.PI / sides))));
  }
  return o;
})();

const get_real_regpoly_size = function(_sides: number) {
  return 1;
  /*
  if (sides >= regpolySizes.length) {
    return 1;
  } else if (Math.floor(sides) == sides) {
    return regpolySizes[sides];
  } else {
    return Math.sqrt((2 * Math.PI / sides) * (1 / Math.sin(2 * Math.PI / sides)));
  }
  */
};

const in_rect = function(x: number, y: number, rx: number, ry: number, rw: number, rh: number) {
  return (rx <= x && ry <= y && rx + rw >= x && ry + rh >= y);
};

const in_rectangle = function(x: number, y: number, rx: number, ry: number, rw: number, rh: number) {
  return in_rect(x, y, rx - rw / 2, ry - rh / 2, rw, rh);
};

const round = function(value: number, decimals: number) {
  return Number(Math.round(+(value + "e" + decimals)) + "e-" + decimals);
};

const round_to = function(value: number, multiple: number) {
  return Number(Math.round(value / multiple) * multiple);
};

const fix_precision = function(value: number) {
  return round(value, 10);
};

const bound = function(n: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, n));
};

const get_color_component = (number_from_0_to_1: number) => {
  let result = Math.floor(number_from_0_to_1 * 255).toString(16);
  result = result.length == 1 ? "0" + result : result;
  return result;
};

const get_color_alpha = (hex: string) => {
  if (hex.length === 8) {
    return parseInt(hex.substring(6), 16) / 255;
  } else if (hex.length === 4) {
    return parseInt(hex.substring(3), 16) / 16;
  } else {
    return 0;
  }
};

const set_color_alpha = (hex: string, alpha: number) => {
  return hex + get_color_component(alpha);
};

const deg_to_rad = (deg: number) => {
  return deg / 180 * Math.PI;
};

const rad_to_deg = (rad: number) => {
  return rad / Math.PI * 180;
};

// ui stuff

const lerp = (a: number, b: number, s: number) => {
  return a * (1 - s) + b * s;
};

const bounce = (time: number, period: number) => {
  return Math.abs(period - time % (period * 2)) / period;
};

// matter vector stuff

const vector_create = function(x: number, y: number) {
  return { x: x || 0, y: y || 0 };
};

const rand = function(a = 1, b?: number) {
  if (b != undefined) {
    return a + Math.random() * (b - a);
  } else {
    return Math.random() * a;
  }
};

const randint = function(a: number, b: number) {
  return Math.floor(rand(a, b + 1));
};

const randbool = function() {
  return Math.random() > 0.5;
};

const randgauss = function(mean: number, deviation: number) {
  let x1, x2, w;
  do {
    x1 = 2 * Math.random() - 1;
    x2 = 2 * Math.random() - 1;
    w = x1 * x1 + x2 * x2;
  } while (0 === w || w >= 1);

  w = Math.sqrt(-2 * Math.log(w) / w);
  return mean + deviation * x1 * w;
};

const randstring = (length = 10) => {
  const letters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += letters.charAt(
      Math.floor(Math.random() * letters.length),
    );
  }
  return result;
};

export const math_util = {
  regpoly, get_real_regpoly_size,
  in_rect, in_rectangle,
  round, round_to, fix_precision, bound,
  get_color_component, get_color_alpha, set_color_alpha,
  deg_to_rad, rad_to_deg,
  lerp, bounce,
  vector_create,
  rand, randint, randbool, randgauss, randstring,
};