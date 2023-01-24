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

// deno-lint-ignore ban-types
export const math_util: Record<string, Function> = { };

export const SQRT_2 = Math.sqrt(2);
export const SQRT_3 = Math.sqrt(3);
export const SQRT_5 = Math.sqrt(5);

math_util.regpoly = function(sides: number, size: number, angle = 0, x = 0, y = 0) {
  const ans: _vectortype[] = [];
  let a = angle;
  size *= math_util.get_real_regpoly_size(sides);
  for (let i = 0; i < sides; ++i) {
    ans.push(math_util.vector_create(x + size * Math.cos(a), y + size * Math.sin(a)));
    a += Math.PI * 2 / sides;
  }
  return ans;
}

const _regpolySizes = (() => {
  const o = [1, 1, 1]; 
  for (let sides = 3; sides < 16; sides++) {
    o.push(Math.sqrt((2 * Math.PI / sides) * (1 / Math.sin(2 * Math.PI / sides))));
  }
  return o;
})();

math_util.get_real_regpoly_size = function(_sides: number) {
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
}

math_util.in_rect = function(x: number, y: number, rx: number, ry: number, rw: number, rh: number) {
  return (rx <= x && ry <= y && rx + rw >= x && ry + rh >= y);
}

math_util.in_rectangle = function(x: number, y: number, rx: number, ry: number, rw: number, rh: number) {
  return math_util.in_rect(x, y, rx - rw / 2, ry - rh / 2, rw, rh);
}

math_util.round = function(value: number, decimals: number) {
  return Number(Math.round(+(value + "e" + decimals)) + "e-" + decimals);
}

math_util.round_to = function(value: number, multiple: number) {
  return Number(Math.round(value / multiple) * multiple);
}

math_util.fix_precision = function(value: number) {
  return math_util.round(value, 10);
}

math_util.bound = function(n: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, n));
}

math_util.get_color_component = (number_from_0_to_1: number) => {
  let result = Math.floor(number_from_0_to_1 * 255).toString(16);
  result = result.length == 1 ? "0" + result : result;
  return result;
}

math_util.get_color_alpha = (hex: string) => {
  if (hex.length === 8) {
    return parseInt(hex.substring(6), 16) / 255;
  } else if (hex.length === 4) {
    return parseInt(hex.substring(3), 16) / 16;
  } else {
    return 0;
  }
}

math_util.set_color_alpha = (hex: string, alpha: number) => {
  return hex + math_util.get_color_component(alpha);
}

math_util.deg_to_rad = (deg: number) => {
  return deg / 180 * Math.PI;
}

math_util.rad_to_deg = (rad: number) => {
  return rad / Math.PI * 180;
}

// ui stuff

math_util.lerp = (a: number, b: number, s: number) => {
  return a * (1 - s) + b * s;
}

math_util.bounce = (time: number, period: number) => {
  return Math.abs(period - time % (period * 2)) / period;
}

// matter vector stuff

math_util.vector_create = function(x: number, y: number) {
  return { x: x || 0, y: y || 0 };
};