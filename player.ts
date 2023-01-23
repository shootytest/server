import { config } from "./config.ts";
import { Controls } from "./controls.ts";
import { make } from "./make.ts";
import { _vectortype } from "./math.ts";
import { Matter } from "./matter.js";
import { Thing } from "./thing.ts";

const Body = Matter.Body,
      Vector = Matter.Vector;

export class Player extends Thing {

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
  controls: Controls = new Controls();
  old_player_position: _vectortype = Vector.create();

  constructor() {
    super(Vector.create(0, 0));
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
      this.target.facing = Vector.create(0, 0); // camera.mouse_position;
      // move player
      const move_x = (this.controls.right ? 1 : 0) - (this.controls.left ? 1 : 0);
      const move_y = (this.controls.down ? 1 : 0) - (this.controls.up ? 1 : 0);
      console.log(move_x, move_y);
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
    if (this.health <= 0) {
      // you are dead
      if (!this.player_dead) {
        this.player_dead = true;
        this.player_dead_time = Thing.time + config.game.respawn_time;
        Body.setVelocity(this.body, Vector.create());
        this.old_player_position = this.position;
      }
      if (this.killer != null) {
        Body.setPosition(this.body, this.killer.position);
      }
    }
    /*
    if (this.player_dead_time != 0 && this.player_dead_time < Thing.time) {
      this.player_dead = false;
      this.player_dead_time = 0;
      this.health.restore();
      this.make_visible();
      this.position = this.old_player_position;
      Body.setPosition(this.body, this.old_player_position);
      this.health.invincible = true;
      this.player_invincibility_time = Thing.time + config.game.respawn_invincibility;
    }
    if (this.player_invincibility_time != 0 && this.player_invincibility_time < Thing.time) {
      this.player_invincibility_time = 0;
      this.health.invincible = false;
    }
    */
  }

  move_player(v: _vectortype) {
    this.move_force(Vector.normalise(v));
  }

  /*
  shoot() {
    if (this.player_dead) return;
    super.shoot();
  }
  */
  
}