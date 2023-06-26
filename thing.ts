import { category, config, _collision_filter } from "./config.ts";
import { Health } from "./health.ts";
import { world } from "./main.ts";
import { make, maketype } from "./make.ts";
import { math_util, _segmenttype, _vectortype } from "./math.ts";
import { Matter } from "./matter.js";
import { shoot_stats } from "./shoot.ts";

const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Query = Matter.Query,
      Vector = Matter.Vector;

// let world = undefined;

export interface matter_body {
  position: _vectortype;
  velocity: _vectortype;
  angle: number;
  mass: number;
  friction: number;
  restitution: number;
  thing: Thing;
  [key: string]: unknown;
}

export interface thing_data {
  id: number;
  x: number;
  y: number;
  a: number;
  r: number;
  shape: number;
  deco: number;
  hp: number; // health
  hc: number; // health capacity
  ab: number; // ability
  ac: number; // ability capacity
  tl: number; // time left
  fov: number;
  c: number;
  t: number;
  f: number;
  chat?: string[],
}

export interface wall_data {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  c: number,
  f: number,
}

export class Thing {

  static things: Thing[] = [];
  static walls: Thing[] = [];
  static enemies: Thing[] = [];
  static players: Thing[] = [];

  static cumulative_id = 0;
  static time = 1;

  static tick_things = () => {
    for (const thing of Thing.things) {
      thing.tick();
    }
    Thing.time++;
  }

  static data = (): thing_data[] => {
    const thingdata: thing_data[] = [];
    for (const thing of Thing.things) {
      if (!thing.exists) continue;
      if (thing.wall) continue;
      thingdata.push(thing.data());
    }
    return thingdata;
  }

  static walldata = (): wall_data[] => {
    const walldata: wall_data[] = [];
    for (const thing of Thing.things) {
      if (!thing.exists) continue;
      if (!thing.wall) continue;
      walldata.push(...thing.wall_data());
    }
    return walldata;
  }

  // thing id
  id: number = ++Thing.cumulative_id;

  // location variables
  body?: matter_body = undefined; // physics body
  size = 0;
  target: {
    position: _vectortype,
    velocity: _vectortype,
    facing: _vectortype,
    angle: number,
  } = {
    position: Vector.create(),
    velocity: Vector.create(),
    facing: Vector.create(),
    angle: 0,
  };
  controller = "none";
  movement_controller = "none";
  rotation_controller = "none";

  // booleans
  exists = false;
  invisible = false;
  fixed = false;
  wall = false;
  deleted = false;
  player = false;
  bullet = false;
  tower = false;
  bullet_deleter = false;
  blocks_sight = false;
  show_health = false;
  show_time_left = false;

  // number
  team = 0;
  health = new Health(this);
  damage = 0;
  speed = 0;
  fov = 10;
  speed_death = -1;
  size_death = -1;
  time_death = -1;
  time_death_original?: number;
  homing_amount = 0.05;
  spin_rate = 0;

  // properties
  killer: Thing | _vectortype = Vector.create(0, 0);
  make_type = "";

  // physics
  friction = 0;
  restitution = 0;
  density = 0.001;
  collision_filter: _collision_filter = category.thing;

  // display variables
  color = 0;
  shape = 0;
  deco = 0;
  
  // pew
  shooting = false;
  shoots: shoot_stats[] = [];
  shoots_time: number[] = [];
  shoots_duration: number[] = [];
  shoots_duration_time: number[] = [];
  shoot_delay: { time: number, s: shoot_stats }[] = []; // use pq?
  shoot_parent: Thing = this;
  shoot_children: Thing[] = [];

  // only for walls
  segment?: _segmenttype;

  // deno-lint-ignore no-explicit-any
  [key: string]: any;

  constructor(position?: _vectortype) {
    if (position != undefined) {
      this.position = Vector.clone(position);
    }
  }

  make(o: maketype) {

    if (o == undefined) {
      return;
    }

    // inheritance first
    if (Object.prototype.hasOwnProperty.call(o, "parent")) {
      for (const make_thing of o.parent || []) {
        this.make(make[make_thing]);
      }
    }

    for (const k in o) {
      if (o[k] != undefined && Object.prototype.hasOwnProperty.call(o, k)) {

        if (k === "shoots" && o.shoots != undefined) {
          if (o.shoots[0].type === "delete") {
            this.shoots = [];
            this.shoots_time = [];
            this.shoots_duration = [];
            this.shoots_duration_time = [];
          }
          for (const S of o.shoots) {
            if (typeof S === "string") continue;
            const to_push: shoot_stats = {};
            const recursive_add = (shoot_obj: shoot_stats, parented = false) => {
              if (shoot_obj.parent != undefined && !parented) {
                recursive_add(shoot_obj.parent);
                recursive_add(shoot_obj, true);
                return;
              }
              for (const key in shoot_obj) {
                if (!Object.prototype.hasOwnProperty.call(shoot_obj, key) || key === "parent" || shoot_obj[key] == undefined) continue;
                to_push[key] = shoot_obj[key];
              }
            }
            recursive_add(S);
            this.shoots.push(to_push);
          }
          for (const _not_used of o.shoots) {
            // init shoots_time and others
            this.shoots_time.push(0);
            this.shoots_duration.push(0);
            this.shoots_duration_time.push(0);
          }
          continue;
        }

        // health stuff
        if (k === "health" && o.health != undefined) {
          const h = o.health;
          if (h.capacity != undefined) {
            this.health.set_capacity(h.capacity);
          }
          if (h.capacity_mult != undefined) {
            this.health.set_capacity(this.health.capacity * h.capacity_mult);
          }
          if (h.ability_capacity != undefined) {
            this.health.set_ability_capacity(h.ability_capacity);
          }
          if (h.ability_capacity_mult != undefined) {
            this.health.set_capacity(this.health.ability_capacity * h.ability_capacity_mult);
          }
          if (h.ability_regen != undefined) {
            this.health.ability_regen = h.ability_regen / 60;
          }
          if (h.regen != undefined) {
            this.health.regen = h.regen / 60;
          }
          if (h.regen_mult != undefined) {
            this.health.regen *= h.regen_mult;
          }
          if (h.regen_time != undefined) {
            this.health.hit_clear = h.regen_time * 60;
          }
          continue;
        }

        // normal properties
        this[k] = o[k];

      }
    }
  }

  get position(): _vectortype {
    return (this.body) ? Vector.clone(this.body.position) : Vector.clone(this.target.position);
  }

  set position(position) {
    this.target.position = Vector.create(position.x, position.y);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get angle() {
    return this.body?.angle || this.target.angle;
  }

  set angle(angle) {
    this.target.angle = angle;
  }
  
  get rotation() {
    return this.angle;
  }

  set rotation(rotation) {
    this.angle = rotation;
  }

  get direction() {
    return this.target.angle;
  }

  set direction(direction) {
    this.angle = direction;
  }

  get rotation_vector() {
    const r = this.rotation;
    return Vector.create(Math.cos(r), Math.sin(r));
  }

  get velocity(): _vectortype {
    return (this.body) ? Vector.clone(this.body.velocity) : Vector.create();
  }

  set velocity(velocity) {
    this.target.velocity = Vector.create(velocity.x, velocity.y);
  }

  get time_death_ratio() {
    return this.time_death_original ? this.time_death / this.time_death_original : 0;
  }

  tick() {
    this.health.tick();
    this.tick_control();
    this.tick_rotate();
    this.tick_move();
    this.tick_shoot();
    this.tick_body();
    this.tick_death();
    this.shoot();
  }

  tick_control() {
    switch (this.controller) {
      case "none":
        break;
      case "target": {
        const target = this.nearest_player();
        if (target === undefined) {
          this.shooting = false;
          break;
        }
        this.shooting = true;
        this.target.facing = target.position;
        break;
      }
      default: {
        console.error("Unknown controller: " + this.controller);
        break;
      }
    }
  }

  tick_move() {
    if (this.body == undefined) return;
    switch (this.movement_controller) {
      case "fixed":
        break;
      case "homing": {
        Body.setVelocity(this.body, Vector.createpolar(this.angle, Vector.magnitude(this.body.velocity)));
        break;
      }
      case "none":
        break;
      default: {
        console.error("Unknown movement controller: " + this.movement_controller);
        break;
      }
    }
  }

  tick_rotate() {
    if (this.body == undefined) return;
    switch (this.rotation_controller) {
      case "fixed":
      case "homing": { // slowly turn towards target
        const new_rotation: number = Vector.angle(this.position, this.shoot_parent.target.facing);
        this.target.angle = Vector.lerp_angle(this.target.angle, new_rotation, this.homing_amount || 0.1);
        break;
      }
      case "target": { // slowly turn towards my target
        const new_rotation: number = Vector.angle(this.position, this.target.facing);
        this.target.angle = Vector.lerp_angle(this.target.angle, new_rotation, this.homing_amount || 0.1);
        break;
      }
      /*
      case "homing_player":
        const nearest_enemy_1 = Enemy.nearest(this.position);
        if (nearest_enemy_1 != undefined) this.target.facing = nearest_enemy_1.position;
        this.target.angle =
          Vector.lerp_angle(this.target.angle, Vector.angle(this.position, this.target.facing), this.homing_amount);
        break;
      case "homing_enemy": // automatically target the player
        this.target.facing = player.position;
        this.target.angle =
          Vector.lerp_angle(this.target.angle, Vector.angle(this.position, this.target.facing), this.homing_amount);
        break;
      case "autotarget_player": // automatically target nearest enemies
        const nearest_enemy_2 = Enemy.nearest(this.position);
        if (nearest_enemy_2 != undefined) this.target.facing = nearest_enemy_2.position;
        this.target.angle = Vector.angle(this.position, this.target.facing);
        break;
      case "autotarget_enemy": // automatically target the player
        this.target.facing = player.position;
        this.target.angle = Vector.angle(this.position, this.target.facing);
        break;
      case "escape": // automatically escape nearest player_bullets
        const pi = Math.PI;
        let nearest_bullet = Player.nearest_bullet(this.position);
        if (nearest_bullet == undefined) break;
        const cross_product = (Vector.cross(nearest_bullet.velocity, Vector.sub(this.position, nearest_bullet.position)));
        let dir = (cross_product < 0 ? 1 : 3) * pi / 2;
        if (nearest_bullet != undefined) this.target.facing = Vector.rotateAbout(nearest_bullet.position, dir, this.position);
        this.target.angle = Vector.angle(this.position, this.target.facing);
        break;
      */
      case "player":
      case "enemy": {
        this.angle = Vector.angle(this.position, this.target.facing);
        break;
      }
      case "spin": {
        // constantly spin
        this.angle += Vector.deg_to_rad(this.spin_rate);
        break;
      }
      case "none":
        break;
      default: {
        console.error("Unknown rotation controller: " + this.rotation_controller);
        break;
      }
    }
    if (this.rotation_controller !== "fixed") {
      Body.setAngle(this.body, this.target.angle);
    }
  }

  tick_shoot() {
    for (let i = 0; i < this.shoots.length; i++) {
      const reload = (this.shoots[i].reload || 0);
      const duration = this.shoots[i].duration;
      const duration_reload = this.shoots[i].duration_reload;
      let canshoot = this.shoots[i].auto;
      if (this.shoots_time[i] < reload && this.shoots_duration[i] <= 0) {
        this.shoots_time[i] += this.reload_boost_time ? 2 : 1;
      }
      if (typeof duration === "number" && duration > 0) {
        if ((this.shooting || this.shoots_duration[i] > 0) && this.shoots_time[i] >= reload && this.shoots_duration[i] < duration) {
          this.shoots_duration[i] += 1;
          canshoot = true;
        }
        if (duration_reload != undefined && duration_reload > 0 && this.shoots_duration_time[i] < duration_reload) {
          this.shoots_duration_time[i]++;
        }
      }
      if (!this.shooting && canshoot) {
        this.shoot_index(i);
      }
    }
    for (const delayed of this.shoot_delay) {
      if (Thing.time >= delayed.time) {
        this.shoot_bullet(delayed.s);
        const index = this.shoot_delay.indexOf(delayed);
        if (index != undefined && index > -1) {
          this.shoot_delay.splice(index, 1);
        }
      }
    }
  }

  tick_body() {
    if (this.body == undefined) return;
  }
  
  tick_death() {
    if (this.deleted) {
      this.remove();
    }
    if (this.wall) return;
    if (this.time_death > -1) {
      if (this.time_death > 0) {
        this.time_death--;
      } else {
        this.remove();
      }
    }
    if (this.size_death > 0) {
      if (this.size > this.size_death) {
        this.remove();
      }
    }
    if (this.speed_death > 0) {
      if (Vector.magnitudeSquared(this.velocity) < this.speed_death * this.speed_death) {
        this.remove();
      }
    }
    if (this.health.zero()) {
      if (!this.player) {
        this.remove();
      }
    }
  }

  /*
  get_shoot_ratio(shoot_index: number, is_duration: boolean) {
    if (this.shoots.length <= 0) return 0;
    if (this.dummy) return 1;
    if (is_duration) {
      shoot_index = shoot_index || 0;
      return Math.min(1, this.shoots_duration_time[shoot_index] / (this.shoots[shoot_index]?.duration_reload || 1));
    }
    shoot_index = shoot_index || 0;
    const reload = this.shoots[shoot_index].reload || 0;
    const delay = this.shoots[shoot_index].delay || 0;
    const shoots_time = this.shoots_time[shoot_index];
    if (reload === 0 || shoots_time === 0) return 0;
    let result;
    if (delay === 0) {
      result = this.shoots_time[shoot_index] / reload;
    } else {
      result = ((this.shoots_time[shoot_index] - delay + reload * 1000) % reload) / reload;
    }
    if (result === 0) return 1;
    return math_util.bound(result, 0, 1);
  }
  */

  shoot() {
    for (let index = 0; index < this.shoots.length; index++) {
      const s = this.shoots[index];
      // shoot conditions
      // if (s.never_shoot || s.death) continue;
      if (this.shooting || s.shooting || s.always_shoot) {
        //if (s.activate_below != undefined && this.health.health / this.health.capacity > s.activate_below) continue;
        //if (s.activate_above != undefined && this.health.health / this.health.capacity < s.activate_above) continue;
        this.shoot_index(index);
      }
    }
  }

  shoot_index(index: number) {
    const s = this.shoots[index];
    const reload = (this.shoots[index].reload || 0);
    let t = this.shoots_time[index];
    while (reload != undefined && t >= reload) {
      if (typeof s.duration === "number" && s.duration > 0 && s.duration_reload) {
        // duration_reload time
        while (this.shoots_duration_time[index] >= s.duration_reload) {
          this.shoot_do(s);
          this.shoots_duration_time[index] -= s.duration_reload;
        }
      } else {
        // shoot!
        this.shoot_do(s);
      }
      if (typeof s.duration === "number" && s.duration > 0) {
        if (this.shoots_duration[index] >= s.duration) {
          t -= reload;
          this.shoots_duration[index] = 0;
        } else {
          break;
        }
      } else {
        t -= reload;
      }
    }
    this.shoots_time[index] = t;
  }

  shoot_do(s: shoot_stats) {
    if (s.move) {
      this.shoot_move(s);
    } else {
      if (s.delay != undefined && s.delay > 0) {
        const delay = this.reload_boost_time ? s.delay / 2 : s.delay;
        this.shoot_delay.push({ time: Thing.time + delay, s: s });
      } else {
        this.shoot_bullet(s);
      }
    }
  }

  shoot_bullets(S: shoot_stats[]) {
    for (const s of S) {
      if (s.delay != undefined && s.delay > 0) {
        const delay = this.reload_boost_time ? s.delay / 2 : s.delay;
        this.shoot_delay.push({ time: Thing.time + delay, s: s });
      } else {
        this.shoot_bullet(s);
      }
    }
  }

  shoot_bullet(S: shoot_stats) {
    if (this.body == undefined) return;
    const location: _vectortype = Vector.add(this.position, Vector.rotate(Vector.create((S.x || 0) * this.size, (S.y || 0) * this.size), this.angle));
    const b = new Thing(location);
    b.make(make.bullet);
    b.make(make["bullet_" + S.type]);
    // bullet properties (optional, might have already been set up in the previous step)
    if (S.size != undefined) {
      const spreadsize = S.spreadsize || 0;
      const size = spreadsize === 0 ? S.size : math_util.randgauss(S.size, spreadsize);
      b.size = size;
    }
    b.damage = S.damage || 0;
    b.health.set_capacity(S.health || 0);
    if (S.color != undefined) {
      b.color = S.color;
    }
    if (S.time != undefined) {
      b.time_death = S.time * 60;
      b.time_death_original = S.time * 60;
    }
    if (S.friction != undefined) {
      b.friction = S.friction;
    }
    if (S.death) {
      b.keep_this = true;
    }
    if (S.color) b.color = S.color;
    if (S.deco) b.deco = S.deco;
    if (S.options != undefined) {
      for (const k in S.options) {
        if (S.options[k] == undefined) continue;
        b[k] = S.options[k];
      }
    }
    b.team = this.team;
    b.shoot_parent = this.shoot_parent;
    // shoot the bullet with correct rotation and speed
    const rot = math_util.randgauss(this.target.angle + (Vector.deg_to_rad(S.angle || 0)), S.spread || 0);
    const facing = this.target.facing;
    const spreadv = S.spreadv || 0;
    let spd = spreadv === 0 ? (S.speed || 0) : math_util.randgauss(S.speed || 0, spreadv);
    const thing_velocity = Vector.rotate(this.velocity, -rot).x;
    if (spd !== 0) spd += thing_velocity * config.physics.velocity_shoot_boost * (S.boost_mult == undefined ? 1 : S.boost_mult);
    if (S.target_type != undefined) {
      /*
      if (S.target_type === "enemy") {
        const nearest_enemy = Enemy.nearest(location);
        if (nearest_enemy != undefined) facing = nearest_enemy.position;
        rot = Vector.angle(location, facing);
      }
      */
    }
    const rotvector = Vector.create(Math.cos(rot), Math.sin(rot));
    b.velocity = Vector.mult(rotvector, spd);
    // target the correct location
    b.target.facing = facing;
    b.rotation = rot;
    // add to children
    this.shoot_children.push(b);
    // create bullet!
    b.create();

    // also do stuff to body of thing
    // do recoil
    if (S.recoil !== 0 && this.body != undefined && spd && S.speed) {
      let recoil = (S.recoil == undefined) ? 1 : S.recoil;
      recoil *= spd * (b.body?.mass || 0) * config.physics.force_factor * config.physics.recoil_factor;
      this.push_to(Vector.add(this.position, rotvector), -recoil);
    }
  }

  shoot_move(S: shoot_stats) {
    if (!S.move || this.body == undefined) return;
    this.push_to(this.target.facing, (S.speed || 0) * this.body.mass * config.physics.force_factor);
  }

  create() {
    this.create_list();
    this.create_body();
    this.create_shoot();
    this.exists = true;
  }

  create_list() {
    if (!Thing.things.includes(this)) {
      Thing.things.push(this);
    }
    if (this.player && !Thing.players.includes(this)) {
      Thing.players.push(this);
    }
    if (this.enemy && !Thing.enemies.includes(this)) {
      Thing.enemies.push(this);
    }
    if (this.wall && !Thing.walls.includes(this)) {
      Thing.walls.push(this);
    }
  }

  create_body() {
    if (this.no_body) return;
    if (this.body != undefined) {
      this.remove_body();
    }
    this.collision_filter.group = -this.team;
    const shape = this.shape;
    const options = {
      isStatic: this.fixed,
      isBullet: this.bullet,
      collisionFilter: this.collision_filter,
      // label: this.label,
      density: this.density * config.physics.density_factor,
      restitution: this.restitution,
      frictionAir: this.friction * config.physics.friction_factor,
      friction: 0,
      frictionStatic: 0,
    };
    let body: matter_body;
    const local_position = Vector.create(0, 0);
    const local_x = local_position.x;
    const local_y = local_position.y;
    if (shape === 0) {
      body = Bodies.circle(local_x, local_y, this.size, options);
    } else if (shape === 1 && this.segment != undefined) {
      const dx = this.segment.x2 - this.segment.x1;
      const dy = this.segment.y2 - this.segment.y1;
      const x = 0;
      const y = 0;
      const w = 1;
      const h = Math.sqrt(dx * dx + dy * dy);
      body = Bodies.rectangle(x, y, w, h, options);
    } else if (shape < 0) {
      // body = Bodies.rectangle(x, y, w, h, options);
      console.error("negative thing shape: " + shape);
      return;
    } else if (shape > 0) {
      const vertices = math_util.regpoly(shape, this.size, 0, local_x, local_y);
      body = Bodies.fromVertices(local_x, local_y, [vertices], options); // Bodies.polygon(x, y, shape.sides, r, options);
    } else {
      console.error("invalid thing shape: " + shape);
      return;
    }
    body.thing = this;
    body.restitution = this.restitution;
    Body.setPosition(body, this.target.position);
    Body.setAngle(body, this.target.angle);
    this.body = body;
    Composite.add(world, this.body);
    // set velocity
    Body.setVelocity(body, this.target.velocity);
  }

  create_shoot() {
    for (let i = 0; i < this.shoots.length; i++) {
      this.shoots_time[i] = 0;
      this.shoots_duration[i] = 0;
    }
  }
  
  data(): thing_data {
    return {
      id: this.id,
      x: Math.round(this.x),
      y: Math.round(this.y),
      a: math_util.round_to(this.angle, 0.001),
      r: math_util.round_to(this.size, 0.1),
      shape: this.shape,
      deco: Math.round(this.deco),
      hp: (this.show_health ? Math.round(this.health.display) : 0),
      hc: (this.show_health ? Math.round(this.health.capacity) : 0),
      ab: (this.player ? Math.round(this.health.ability_display) : 0),
      ac: (this.player ? Math.round(this.health.ability_capacity) : 0),
      tl: (this.show_time_left ? math_util.round_to(this.time_death_ratio, 0.01) : 0),
      fov: math_util.round_to(this.fov, 0.1),
      c: this.color,
      t: this.team,
      f:  (this.player ? 0x0001 : 0) +
          (this.show_health ? 0x0002 : 0) +
          (this.invisible ? 0x0004 : 0) +
          (this.health.invincible ? 0x0008 : 0) +
          (this.show_time_left ? 0x0010 : 0),
    };
  }

  points_data(): _vectortype[] {
    const points: _vectortype[] = [];
    if (this.wall && this.segment != undefined && this.segment.x1 != undefined) {
      points.push(
        Vector.create(this.segment.x1, this.segment.y1),
        Vector.create(this.segment.x2, this.segment.y2)
      );
    } else {
      const sides = this.shape === 0 ? 16 : Math.abs(this.shape);
      points.push(...math_util.regpoly(sides, this.size, this.angle, this.x, this.y));
    }
    return points;
  }

  wall_data(): wall_data[] {
    const points = this.points_data();
    const points_length = points.length;
    const segments: wall_data[] = [ ];
    const c = this.color;
    const f: number =  (this.blocks_sight ? 0x0001 : 0) +
                          (this.wall_border ? 0x0002 : 0);

    if (points_length === 2) {
      const p1 = points[0];
      const p2 = points[1];
      segments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, c, f });
    } else if (points_length > 2) {
      for (let i = 0; i < points_length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points_length];
        segments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, c, f });
      }
    } else {
      console.error(`thing.wall_data(): less than 2 (${points_length}) points!`);
    }

    return segments;
  }

  remove() {
    this.remove_before();
    this.remove_list();
    this.remove_body();
    this.remove_children();
    this.exists = false;
  }

  remove_before() {
    // do shoot_death
    /*
    for (let index = 0; index < this.shoots.length; index++) {
      const s = this.shoots[index];
      if (s.death) {
        this.shoot_index(index);
      }
    }
    */
  }

  remove_list() {
    for (const array of [Thing.things, Thing.walls, Thing.enemies, Thing.players, this.shoot_parent.shoot_children]) {
      // remove this from array
      const index = array.indexOf(this);
      if (index != undefined && index > -1) {
        array.splice(index, 1);
      }
    }
  }

  remove_body() {
    if (this.body != undefined) {
      // remove from world
      Composite.remove(world, this.body);
      this.body = undefined;
      return true;
    } else {
      return false;
    }
  }

  remove_children() {
    if (this.keep_children) return;
    for (const c of this.shoot_children) {
      if (c.keep_this) continue;
      c.remove();
    }
  }

  remove_shoots() {
    this.shoots = [];
    this.shoots_time = [];
    this.shoots_duration = [];
    this.shoots_duration_time = [];
  }

  query_point(x: number | _vectortype, y?: number) {
    let v: _vectortype | number; // actually only _vectortype
    if (y != undefined) v = Vector.create(x, y);
    else v = x;
    return Query.point([this.body], v);
  }

  move_force(v: _vectortype, mult = 0) {
    if (this.body == undefined) return;
    const move_v = Vector.mult(v, mult * this.speed * this.body.mass * config.physics.force_factor);
    if (this.body != undefined) {
      Body.applyForce(this.body, this.position, move_v);
    }
  }

  move_to(position: _vectortype) {
    this.target.position = Vector.clone(position);
  }

  push_to(target: _vectortype, amount: number) {
    const push: _vectortype = Vector.mult(Vector.createpolar(Vector.angle(this.position, target), 1), amount);
    if (this.body != undefined && this.position != undefined && push.x != undefined && push.y != undefined) {
      Body.applyForce(this.body, this.position, push);
    }
  }

  make_invisible() {
    this.invisible = true;
    Composite.remove(world, this.body);
  }

  make_visible() {
    this.invisible = false;
    Composite.add(world, this.body);
  }
  
  nearest_player(ignore_fov = false) {
    const disposition = this.position;
    let result;
    let distance2 = 0;
    // if not ignore_fov, the thing only can see within its field of view
    let best = ignore_fov ? 1234567890 : (this.fov * this.size) * (this.fov * this.size);
    for (const player of Thing.players) {
      if (player.player_dead || player.invisible) continue;
      if (player.team === this.shoot_parent.team) continue;
      distance2 = Vector.magnitudeSquared(Vector.sub(disposition, player.position)) - player.size;
      if (distance2 <= best) {
        best = distance2;
        result = player;
      }
    }
    return result;
  }

}