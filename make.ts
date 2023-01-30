import { colors } from "./color.ts";
import { category, config, _collision_filter } from "./config.ts";
import { _vectortype  } from "./math.ts";
import { shoots, shoot_stats } from "./shoot.ts";

export class maketype {
  parent?: string[];
  fixed?: boolean;
  player?: boolean;
  wall?: boolean;
  enemy?: boolean;
  bullet?: boolean;
  tower?: boolean;
  blocks_sight?: boolean;
  bullet_deleter?: boolean;
  show_health?: boolean;
  show_time_left?: boolean;
  size?: number;
  shape?: number;
  deco?: number;
  speed?: number;
  density?: number;
  friction?: number;
  restitution?: number;
  color?: number;
  health?: {
    capacity?: number;
    ability_capacity?: number;
    ability_regen?: number;
    regen?: number;
    regen_time?: number;
  };
  controller?: string;
  movement_controller?: string;
  rotation_controller?: string;
  collision_filter?: _collision_filter;
  shoots?: shoot_stats[];
  [key: string]: unknown;
}

export const make: Record<string, maketype> = {};

make.default = {
  // nothing here for now, all defaults should be in the Thing class.
};


// _PLAYERS

make.player = {
  player: true,
  rotation_controller: "player",
  size: 30,
  shape: 0,
  deco: 101,
  speed: 50,
  density: 0.001,
  friction: 0.1,
  color: colors.blue,
  damage: 5,
  health: {
    capacity: config.game.player_health,
    ability_capacity: config.game.player_ability_capacity,
    ability_regen: config.game.player_ability_regen,
    regen: config.game.player_regen,
    regen_time: config.game.player_regen_delay,
  },
  show_health: true,
  collision_filter: category.thing,
};

make.player_basic = {
  shoots: [shoots.p_basic],
  deco: 101,
};

make.player_fast = {
  shoots: [shoots.p_fast],
  deco: 301,
};

make.player_faster = {
  shoots: [shoots.p_faster],
  deco: 302,
};

make.player_double = {
  shoots: [{
    parent: shoots.p_double, y: -0.2,
  }, {
    parent: shoots.p_double, y: 0.2, delay: 15,
  }],
  deco: 102,
};

make.player_triple = {
  shoots: [{
    parent: shoots.p_triple, y: -0.3,
  }, {
    parent: shoots.p_triple, delay: 10,
  }, {
    parent: shoots.p_triple, y: 0.3, delay: 20,
  }],
  deco: 103,
};

make.player_large = {
  shoots: [shoots.p_large],
  deco: 501,
};

make.player_launch = {
  shoots: [shoots.p_launch],
  deco: 511,
};

make.player_trap = {
  shoots: [shoots.p_trap],
  deco: 401,
};

make.player_trap_large = {
  shoots: [shoots.p_trap_large],
  deco: 402,
};

make.player_trap_tower = {
  shoots: [shoots.p_trap_t_basic],
  deco: 412,
};


// _WALLS

make.wall = {
  fixed: true,
  wall: true,
  blocks_sight: true,
  bullet_deleter: true,
  color: colors.white,
  collision_filter: category.wall,
};

make.wall_bounce = {
  parent: ["wall"],
  bullet_deleter: false,
  restitution: 1,
  color: colors.wall_yellow,
};

make.wall_window = {
  parent: ["wall"],
  blocks_sight: false,
  color: colors.wall_blue,
};


// _BULLETS

make.bullet = {
  bullet: true,
  player: false,
  friction: 0,
  density: 0.002,
  damage: 1,
  shape: 0,
  deco: 0,
  collision_filter: category.thing,
};

make.bullet_basic = {
  parent: ["bullet"],
};

make.bullet_tower = {
  parent: ["bullet"],
  controller: "target",
  rotation_controller: "target",
  deco: 101,
  tower: true,
  show_health: true,
  show_time_left: true,
  fov: 20,
};

make.bullet_tower_basic = {
  parent: ["bullet_tower"],
  shoots: [shoots.t_basic],
};

make.bullet_trap = {
  parent: ["bullet"],
  tower: true,
  fov: 15,
};

make.bullet_trap_large = {
  parent: ["bullet"],
  tower: true,
  show_time_left: true,
  fov: 10,
};

make.bullet_trap_basic = {
  parent: ["bullet_tower"],
  shoots: [shoots.t_trap_basic],
};

make.bullet_launch = {
  parent: ["bullet"],
  shooting: true,
  deco: 101,
  shoots: [shoots.t_launch],
};