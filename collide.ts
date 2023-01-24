import { engine } from "./main.ts";
import { Matter } from "./matter.js"
import { matter_body, Thing } from "./thing.ts";

const Events = Matter.Events;

interface matter_pair {
  bodyA: matter_body;
  bodyB: matter_body;
}

function collide(a: matter_body, b: matter_body, _pair: matter_pair) {
  const t = a.thing;
  const u = b.thing;
  if (t.deleter && u.bullet) {
    u.deleted = true;
  }
  if (t.health_capacity > 0 && u.damage > 0 && t.team !== u.team) {
    const old_health = t.health;
    t.health -= u.damage;
    t.hit_time = Thing.time;
    const _real_damage = Math.max(0, Math.min(u.damage, old_health));
    t.killer = u.shoot_parent;
    u.deleted = true;
  }
  /*
  if (t.damage > 0 && u.health_capacity > 0 && t.team !== u.team) {
    u.health.hit_add(t.health.damage);
    u.killer = t.shoot_parent;
  }
  */
}

function collide_end(a: matter_body, b: matter_body, _pair: matter_pair) {
  const _t = a.thing;
  const _u = b.thing;
  /*
  if (t.damage > 0 && u.health.capacity > 0) {
    u.health.hit_remove(t.health.damage);
  }
  */
}

export const init_collide = function() {
  Events.on(engine, "collisionStart", function(event: { pairs: matter_pair[]}) {
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      collide(a, b, pair);
      collide(b, a, pair);
    }
  });
  Events.on(engine, "collisionEnd", function(event: { pairs: matter_pair[]}) {
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      collide_end(a, b, pair);
      collide_end(b, a, pair);
    }
  });
}