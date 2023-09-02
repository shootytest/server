import { Socket } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { ability } from "./ability.ts";
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

  socket?: Socket;

  player_autofire = false;
  player_dead = false;
  player_dead_time = 0;
  player_invincibility_time = 0;
  points = 0;
  ability = "none";
  name = "unnamed";
  chat: { m: string, t: number }[] = [];
  controls: Controls = new Controls();
  // old_player_position: _vectortype = Vector.create();

  // specific ability stuff
  speed_boost_time?: number;
  reload_boost_time?: number;

  // damage numbers
  damage_numbers: {
    x: number;
    y: number;
    d: number;
  }[] = [];

  constructor(socket?: Socket) {
    super(Player.random_spawn_location());
    this.socket = socket;
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
    if (this.speed_boost_time != undefined && this.speed_boost_time > 0) {
      const move_x = (this.controls.right ? 1 : 0) - (this.controls.left ? 1 : 0);
      const move_y = (this.controls.down ? 1 : 0) - (this.controls.up ? 1 : 0);
      if (move_x !== 0 || move_y !== 0) {
        this.speed_boost_time -= 1;
      }
    }
    for (const boost_time of ["reload_boost_time"]) {
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
    let move_speed = this.speed_boost_time ? 2 : 1;
    if (this.controls.slow) move_speed /= 1.75;
    this.move_player(Vector.create(move_x, move_y), move_speed);
    // shoot player
    this.shooting = this.player_autofire || this.controls.shoot;
    // dash player
    if (this.controls.rshoot) {
      ability.use(this);
    }
    if (this.controls.exit) {
      this.health.invincible = false;
      this.health.hit(this.health.capacity);
    }
  }

  set_ability(ab: string) {
    this.ability = ab;
    ability.set(this);
  }

  tick_player_test() {
    // nothing for now
  }

  tick_death() {
    super.tick_death();
    if (this.health.zero()) {
      // you are dead
      if (!this.player_dead) {
        this.points = 0;
        this.temp_remove(false);
      }
    }
    if (this.player_dead) {
      if (this.killer != undefined) {
        Body.setPosition(this.body, { x: this.killer.x, y: this.killer.y });
      } else if (Thing.ball != undefined) {
        Body.setPosition(this.body, { x: Thing.ball.x, y: Thing.ball.y });
      }
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

  data() {
    if (this.damage_numbers.length > 0) {
      this.socket?.emit("damage_numbers", this.damage_numbers);
      this.damage_numbers = [];
    }
    const d = super.data();
    const chat = [];
    const ttl  = [];
    const to_remove = [];
    for (const c of this.chat) {
      if (Thing.time > c.t) {
        to_remove.push(c);
        continue;
      }
      chat.push(c.m);
      ttl.push(c.t - Thing.time);
    }
    for (const c of to_remove) {
      this.chat.splice(this.chat.indexOf(c), 1);
    }
    d.chat = chat;
    d.ttl = ttl;
    d.pt = Math.round(this.points);
    d.die = this.player_dead;
    return d;
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
    this.killer = Thing.ball ?? Vector.create(0, 0);
    this.make_visible();
    const new_spawn_position = Player.random_spawn_location();
    this.position = new_spawn_position;
    Body.setPosition(this.body, new_spawn_position);
    this.health.invincible = true;
    this.player_invincibility_time = Thing.time + config.game.respawn_invincibility;
  }
  
}