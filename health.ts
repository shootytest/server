import { config } from "./config.ts";
import { math_util } from "./math.ts";
import { Thing } from "./thing.ts";

export class Health {

  thing: Thing;

  health = 0;
  capacity = 0;
  regen = 0;
  display = 0;

  invincible = false;

  hit_time = -1000000;
  hit_clear = 0;
  hit_tick = 0;

  constructor(thing: Thing) {
    this.thing = thing;
  }

  get ratio() {
    return this.health / this.capacity;
  }

  get percentage() {
    return this.ratio * 100;
  }

  tick() {
    this.display = math_util.lerp(this.display, this.ratio, config.game.health_display_smoothness);
    const time = Thing.time;
    if (this.hit_tick > 0.000001) {
      this.hit(this.hit_tick);
    }
    if ((time - this.hit_time) > this.hit_clear && this.regen !== 0 && this.health < this.capacity) {
      // can regenerate
      this.health += this.regen;
    }
    if (this.health > this.capacity) {
      this.health = this.capacity;
    }
  }

  hit(damage: number) {
    if (this.invincible) return 0;
    const old_health = this.health;
    this.health -= damage;
    this.hit_time = Thing.time;
    const real_damage = Math.max(0, Math.min(damage, old_health));
    return real_damage;
  }

  hit_add(damage: number) {
    if (this.invincible) return;
    this.hit_tick += damage;
  }

  hit_remove(damage: number) {
    if (this.invincible) return;
    this.hit_tick -= damage;
  }

  restore() {
    this.health = this.capacity;
  }

  set_capacity(capacity: number) {
    this.capacity = capacity;
    this.health = capacity;
  }

  zero() {
    return this.capacity > 0 && this.health <= 0;
  }

}