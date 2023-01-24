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
  facing: _vectortype = Vector.create(0, 0);
}