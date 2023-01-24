import { config } from "./config.ts";
import { Controls } from "./controls.ts";
import { make } from "./make.ts";
import { mapmaker } from "./mapmaker.ts";
import { math_util, _vectortype } from "./math.ts";
import { Matter } from "./matter.js";
import { Thing } from "./thing.ts";

const Body = Matter.Body,
      Vector = Matter.Vector;

export class Player extends Thing {

  static get_spawn_zones() {
    const M = mapmaker.get_current_map();
    const zones = M.spawn || [{ x: -M.width, y: -M.height, w: M.width * 2, h: M.height * 2, }];
    return zones;
  }

  static random_spawn_location(padding = 0): _vectortype {
    const zone = math_util.randpick(Player.get_spawn_zones());
    return Vector.create(
      math_util.rand(zone.x + padding, zone.x + zone.w - padding),
      math_util.rand(zone.y + padding, zone.y + zone.h - padding)
    );
  }

  static nearest_bullet(position_vector: _vectortype) {
    let result;
    let distance2 = 0, best = 1234567890;
    for (const t of Thing.things) {
      if (!t.player_bullet || !t.exists) continue;
      distance2 = Vector.magnitudeSquared(Vector.sub(position_vector, t.position));
      if (best === 1234567890 || distance2 < best) {
        best = distance2;
        result = t;
      }
    }
    return result;
  }

  player_autofire = false;
  player_dead = false;
  player_dead_time = 0;
  player_invincibility_time = 0;
  controls: Controls = new Controls();
  // old_player_position: _vectortype = Vector.create();

  constructor() {
    super(Player.random_spawn_location());
    this.make(make.player);
  }

  tick() {
    super.tick();
    this.tick_player();
    this.tick_player_test();
  }

  tick_player() {
    // if not dead
    if (!this.player_dead) {
      // rotate player
      this.target.facing = Vector.create(this.controls.facingx, this.controls.facingy);
      // move player
      const move_x = (this.controls.right ? 1 : 0) - (this.controls.left ? 1 : 0);
      const move_y = (this.controls.down ? 1 : 0) - (this.controls.up ? 1 : 0);
      this.move_player(Vector.create(move_x, move_y));
      // shoot player
      this.shooting = this.player_autofire || this.controls.shoot;
    }
  }

  tick_player_test() {
    // nothing for now
  }

  tick_death() {
    super.tick_death();
    if (this.health.zero()) {
      // you are dead
      if (!this.player_dead) {
        this.player_dead = true;
        this.player_dead_time = Thing.time + config.game.respawn_time;
        Body.setVelocity(this.body, Vector.create());
        this.make_invisible();
        // this.old_player_position = this.position;
      }
      if (this.killer != undefined) {
        Body.setPosition(this.body, this.killer.position);
      }
    }
    if (this.player_dead_time != 0 && this.player_dead_time < Thing.time) {
      this.player_dead = false;
      this.player_dead_time = 0;
      this.health.restore();
      this.make_visible();
      const new_spawn_position = Player.random_spawn_location();
      this.position = new_spawn_position;
      Body.setPosition(this.body, new_spawn_position);
      this.health.invincible = true;
      this.player_invincibility_time = Thing.time + config.game.respawn_invincibility;
    }
    if (this.player_invincibility_time != 0 && this.player_invincibility_time < Thing.time) {
      this.player_invincibility_time = 0;
      this.health.invincible = false;
    }
  }

  move_player(v: _vectortype) {
    this.move_force(Vector.normalise(v));
  }

  shoot() {
    if (this.player_dead) return;
    super.shoot();
  }

  remove() {
    // this shouldn't happen unless socket disconnect
    this.player_dead = true;
    super.remove();
  }
  
}