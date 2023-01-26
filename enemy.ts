import { _vectortype } from "./math.ts";
import { Matter } from "./matter.js";
import { Player } from "./player.ts";
import { Thing } from "./thing.ts";

const Query = Matter.Query,
      Vector = Matter.Vector;

export class Enemy extends Thing {

  /*
  static get_spawn_zones() {
    let zones = maps[waves_info[send.wave_name].map].zones;
    if (zones == null) {
      const M = maps[waves_info[send.wave_name].map];
      zones = [{ x: -M.width, y: -M.height, w: M.width * 2, h: M.height * 2, }];
    }
    return zones;
  }

  static random_zone() {
    return random.randint(0, Enemy.get_spawn_zones().length - 1);
  }

  static random_location(s = 0) {
    const zone = Enemy.get_spawn_zones()[Enemy.random_zone()];
    return Vector.create(random.rand(zone.x + s, zone.x + zone.w - s), random.rand(zone.y + s, zone.y + zone.h - s));
  }

  static create(enemy_type: string, is_boss: boolean) {
    const e = new Enemy();
    e.make(make["enemy_" + enemy_type]);
    e.position = (is_boss) ? Vector.create() : Enemy.random_location(e.size);
    e.create_list();
    return e;
  }
  */

  static blocks_sight_wall_list() {
    const result = [];
    for (const w of Thing.walls) {
      if (!w.blocks_sight) continue;
      result.push(w.body);
    }
    return result;
  }

  static nearest(v: _vectortype) {
    let result;
    let distance2 = 0;
    let best = 1234567890;
    for (const e of Thing.enemies) {
      distance2 = Vector.magnitudeSquared(Vector.sub(v, e.position));
      if (best === 1234567890 || distance2 < best) {
        best = distance2;
        result = e;
      }
    }
    return result;
  }

  enemy_ram = false;
  send_after_death = false;

  constructor(position: _vectortype) {
    super(position); // yes it's superposition
  }

  tick() {
    super.tick();
    this.tick_enemy();
  }

  tick_enemy() {
    // if can see player
    for (const player of Player.players) {
      const can_see_player = !player.player_dead && Query.ray(Enemy.blocks_sight_wall_list(), this.position, player.position).length == 0;
      if (can_see_player && this.target_player) {
        this.target.facing = player.position;
      } else {
        // this.target.facing = Vector.add(this.position, Vector.createpolar(this.target.rotation, 1));
      }
      if (!this.never_shoot && (this.always_shoot || can_see_player)) {
        this.shooting = true;
        this.shoot();
      } else {
        this.shooting = false;
      }
    }
  }

}