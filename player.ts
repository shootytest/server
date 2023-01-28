import { config } from "./config.ts";
import { Controls } from "./controls.ts";
import { make } from "./make.ts";
import { mapmaker } from "./mapmaker.ts";
import { math_util, _vectortype } from "./math.ts";
import { Matter } from "./matter.js";
import { shoots } from "./shoot.ts";
import { Thing } from "./thing.ts";

const Body = Matter.Body,
      Vector = Matter.Vector;

export class Player extends Thing {

  static players: Player[] = [];

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

  static player_data() {
    const playerdata = [];
    for (const player of Player.players) {
      if (!player.exists) continue;
      playerdata.push({
        id: player.id,
        name: player.name,
      });
    }
    return playerdata;
  }

  player_autofire = false;
  player_dead = false;
  player_dead_time = 0;
  player_invincibility_time = 0;
  ability = "none";
  name = "unnamed";
  controls: Controls = new Controls();
  // old_player_position: _vectortype = Vector.create();

  // specific ability stuff
  speed_boost_time?: number;
  reload_boost_time?: number;

  constructor() {
    super(Player.random_spawn_location());
    Player.players.push(this);
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
      this.do_controls();
    }
    // boosts
    for (const boost_time of ["speed_boost_time", "reload_boost_time"]) {
      if (this[boost_time] != undefined && this[boost_time] > 0) {
        this[boost_time] -= 1;
      }
    }
  }

  do_controls() {
    // rotate player
    this.target.facing = Vector.create(this.controls.facingx, this.controls.facingy);
    // move player
    const move_x = (this.controls.right ? 1 : 0) - (this.controls.left ? 1 : 0);
    const move_y = (this.controls.down ? 1 : 0) - (this.controls.up ? 1 : 0);
    this.move_player(Vector.create(move_x, move_y), this.speed_boost_time ? 2 : 1);
    // shoot player
    this.shooting = this.player_autofire || this.controls.shoot;
    // dash player
    if (this.controls.rshoot) {
      this.do_ability();
    }
  }

  do_ability() {
    const move_x = (this.controls.right ? 1 : 0) - (this.controls.left ? 1 : 0);
    const move_y = (this.controls.down ? 1 : 0) - (this.controls.up ? 1 : 0);
    switch (this.ability) {
      case "none": {
        break;
      }
      case "reload_boost": {
        if (this.health.use_ability(100)) {
          // reload boost mode on
          this.reload_boost_time = 60;
        }
        break;
      }
      case "speed_boost": {
        if (this.health.use_ability(100)) {
          // speed boost mode on
          this.speed_boost_time = 75;
        }
        break;
      }
      case "speed": {
        if (this.health.use_ability(2)) {
          // additional move
          this.move_player(Vector.create(move_x, move_y), 1.25);
        }
        break;
      }
      case "tower_basic": {
        if (this.health.use_ability(100)) {
          this.shoot_bullet(shoots.ability_tower);
        }
        break;
      }
      default: {
        break;
      }
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
        this.temp_remove(false);
      }
    }
    if (this.player_dead && this.killer != undefined) {
      Body.setPosition(this.body, { x: this.killer.x, y: this.killer.y });
    }
    if (this.player_dead_time !== 0 && this.player_dead_time < Thing.time) {
      this.temp_create();
    }
    if (this.player_invincibility_time != 0 && this.player_invincibility_time < Thing.time) {
      this.player_invincibility_time = 0;
      this.health.invincible = false;
    }
  }

  move_player(v: _vectortype, mult = 0) {
    this.move_force(Vector.normalise(v), mult);
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

  remove_list() {
    for (const array of [Player.players]) {
      // remove this from array
      const index = array.indexOf(this);
      if (index != undefined && index > -1) {
        array.splice(index, 1);
      }
    }
    super.remove_list();
  }

  temp_remove(respawn: boolean) {
    this.player_dead = true;
    if (respawn) {
      this.player_dead_time = Thing.time + config.game.respawn_time;
    } else {
      this.player_dead_time = 0;
    }
    Body.setVelocity(this.body, Vector.create(0, 0));
    this.make_invisible();
  }

  temp_create() {    
    this.player_dead = false;
    this.player_dead_time = 0;
    this.health.restore();
    this.killer = Vector.create(0, 0);
    this.make_visible();
    const new_spawn_position = Player.random_spawn_location();
    this.position = new_spawn_position;
    Body.setPosition(this.body, new_spawn_position);
    this.health.invincible = true;
    this.player_invincibility_time = Thing.time + config.game.respawn_invincibility;
  }
  
}