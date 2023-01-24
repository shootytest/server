import { _vectortype } from "./math.ts";
import { Matter } from "./matter.js";

const Vector = Matter.Vector;

export class Controls {
  up = false;
  down = false;
  left = false;
  right = false;
  shoot = false;
  rshoot = false;
  facingx = 0;
  facingy = 0;
}