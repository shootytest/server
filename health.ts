import { config } from "./config.ts";
import { math_util } from "./math.ts";
import { Thing } from "./thing.ts";

export class Health {

  thing: Thing;

  health = 0;
  capacity = 0;
  regen = 0;
  display = 0;

  ability = 0;
  ability_capacity = 0;
  ability_regen = 0;
  ability_display = 0;

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

  get ability_ratio() {
    return this.ability / this.ability_capacity;
  }

  get percentage() {
    return this.ratio * 100;
  }

  get full() {
    return this.health >= this.capacity;
  }

  get ability_full() {
    return this.ability >= this.ability_capacity;
  }

  tick() {
    this.display = math_util.lerp(this.display, this.ratio, config.game.health_display_smoothness);
    this.ability_display = math_util.lerp(this.ability_display, this.ability_ratio, config.game.health_display_smoothness);
    const time = Thing.time;
    if (this.hit_tick > 0.000001) {
      this.hit(this.hit_tick);
    }
    if ((time - this.hit_time) > this.hit_clear && this.regen !== 0 && this.health < this.capacity) {
      // can regenerate
      this.health += this.regen;
    }
    if (this.ability < this.ability_capacity) {
      this.ability += this.ability_regen;
    }
    if (this.health > this.capacity) {
      this.health = this.capacity;
    }
    if (this.ability > this.ability_capacity) {
      this.ability = this.ability_capacity;
    }
  }

  hit(damage: number) {
    if (this.invincible) return 0;
    const old_health = this.health;
    this.health -= damage;
    this.bound_health();
    this.hit_time = Thing.time;
    const real_damage = old_health - this.health; // math_util.bound(old_health, 0, damage);
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

  heal(health: number) {
    const old_health = this.health;
    this.health += health;
    this.bound_health();
    if (this.thing.player) {
      const player = this.thing;
      player.damage_numbers.push({
        x: player.x,
        y: player.y,
        d: old_health - this.health, // yes this is negative
      });
    }
  }

  heal_percent(health_percent: number) {
    this.heal(this.capacity * health_percent);
  }

  bound_health() {
    this.health = math_util.bound(this.health, 0, this.capacity);
  }

  restore() {
    this.health = this.capacity;
  }

  set_capacity(capacity: number) {
    this.capacity = capacity;
    this.health = capacity;
  }

  set_ability_capacity(ability_capacity: number) {
    this.ability_capacity = ability_capacity;
    this.ability = ability_capacity;
  }

  use_ability(amount: number) {
    if (this.ability < amount) {
      return false;
    }
    this.ability -= amount;
    return true;
  }

  zero() {
    return this.capacity > 0 && this.health <= 0;
  }

}