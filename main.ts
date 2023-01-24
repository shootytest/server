import { init_collide } from "./collide.ts";
import { config } from "./config.ts";
import { _vectortype } from "./math.ts";
import { Matter } from "./matter.js";
import { Thing } from "./thing.ts";

const Engine = Matter.Engine,
      Runner = Matter.Runner,
      Vector = Matter.Vector;

export const engine = Engine.create({
  gravity: {
    x: config.physics.gravity_x,
    y: config.physics.gravity_y,
  },
});
export const world = engine.world;
const runner = Runner.create();

const init = () => {
  // add some nice Matter.Vector extensions
  (() => {
    Vector.createpolar = function(theta = 0, r = 1) {
      return Vector.create(r * Math.cos(theta), r * Math.sin(theta));
    }
    Vector.lerp = function(v1: _vectortype, v2: _vectortype, smoothness: number) {
      return Vector.add(Vector.mult(v1, 1 - smoothness), Vector.mult(v2, smoothness));
    }
    Vector.lerp_angle = function(a1: number, a2: number, smoothness: number) {
      return Vector.angle(Vector.create(), Vector.add(Vector.createpolar(a1, 1 - smoothness), Vector.createpolar(a2, smoothness)));
    }
    Vector.deg_to_rad = function(degrees: number) {
      return degrees / 180 * Math.PI;
    }
    Vector.rad_to_deg = function(radians: number) {
      return radians * 180 / Math.PI;
    }
  })();
  init_collide();
};

export const tick = (_time: number) => {
  Runner.tick(runner, engine);
  Thing.tick_things();
};

const done = () => {
  // done!
};

export const main = () => {
  init();
  // setInterval(tick, 16);
  done();
};