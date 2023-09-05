import { colors } from "./color.ts";
import { category, config, _collision_filter } from "./config.ts";
import { _segmenttype, _vectortype  } from "./math.ts";
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
  spin_rate?: number;
  health?: {
    capacity?: number;
    capacity_mult?: number;
    ability_capacity?: number;
    ability_capacity_mult?: number;
    ability_regen?: number;
    regen?: number;
    regen_mult?: number;
    regen_time?: number;
  };
  controller?: string;
  movement_controller?: string;
  rotation_controller?: string;
  segment?: _segmenttype;
  dimensions?: { width: number, height: number };
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
  deco: 100,
  speed: 50,
  density: 0.001,
  friction: 0.1,
  color: colors.blue,
  damage: 10,
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
  speed: 50,
  health: {
    capacity_mult: 1,
    regen_mult: 1,
  },
};

make.player_circle = {
  shoots: [],
  deco: 100,
  speed: 65,
  damage: 20,
  health: {
    capacity: 120,
  },
};

make.player_fast = {
  shoots: [shoots.p_fast],
  deco: 301,
  speed: 50,
  health: {
    capacity: 90,
  },
};

make.player_faster = {
  shoots: [shoots.p_faster],
  deco: 302,
  speed: 55,
  health: {
    capacity: 75,
  },
};

make.player_double = {
  shoots: [{
    parent: shoots.p_double, y: -0.2,
  }, {
    parent: shoots.p_double, y: 0.2, delay: 15,
  }],
  deco: 102,
  speed: 50,
  health: {
    capacity: 100,
  },
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
  speed: 50,
  health: {
    capacity: 90,
  },
};

make.player_split3 = {
  shoots: [{
    parent: shoots.p_split3, angle: -12.5,
  }, {
    parent: shoots.p_split3,
  }, {
    parent: shoots.p_split3, angle: 12.5,
  }],
  deco: 113,
  speed: 50,
  health: {
    capacity: 100,
  },
};

make.player_short3 = {
  shoots: [{
    parent: shoots.p_short3, y: -0.6666,
  }, {
    parent: shoots.p_short3,
  }, {
    parent: shoots.p_short3, y: 0.6666,
  }],
  deco: 123,
  speed: 60,
  health: {
    capacity: 100,
  },
};

make.player_large = {
  shoots: [shoots.p_large],
  deco: 501,
  speed: 45,
  health: {
    capacity: 110,
  },
};

make.player_launch = {
  shoots: [shoots.p_launch],
  deco: 511,
  speed: 40,
  health: {
    capacity: 125,
  },
};

make.player_trap = {
  shoots: [shoots.p_trap],
  deco: 401,
  speed: 45,
  health: {
    capacity: 100,
  },
};

make.player_trap_large = {
  shoots: [shoots.p_trap_large],
  deco: 403,
  speed: 40,
  health: {
    capacity: 100,
  },
};

make.player_trap_fast = {
  shoots: [shoots.p_trap_fast],
  deco: 401,
  speed: 40,
  health: {
    capacity: 100,
  },
};

make.player_trap_tower = {
  shoots: [shoots.p_trap_t_basic],
  deco: 412,
  speed: 35,
  health: {
    capacity: 125,
  },
};

make.player_sniper = {
  shoots: [shoots.p_sniper],
  deco: 602,
  speed: 40,
  health: {
    capacity: 64,
  },
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

make.wall_ball = {
  parent: ["wall"], // fake
  fixed: false,
  wall: false,
  bullet_deleter: false,
  blocks_sight: false,
  restitution: 1,
  color: colors.wall_ball,
  deco: 211212,
  collision_filter: category.wall,
};

make.wall_window = {
  parent: ["wall"],
  blocks_sight: false,
  color: colors.wall_blue,
};

make.wall_window_pass = {
  parent: ["wall"],
  blocks_sight: false,
  color: colors.wall_blue,
  collision_filter: category.pass,
};

make.wall_curtain = {
  parent: ["wall"],
  blocks_sight: true,
  bullet_deleter: false,
  color: colors.wall_purple,
  collision_filter: category.none,
};


// _BULLETS

make.bullet = {
  bullet: true,
  player: false,
  friction: 0,
  density: 0.002,
  restitution: 1,
  damage: 1,
  shape: 0,
  deco: 0,
  collision_filter: category.bullet,
};

make.bullet_basic = {
  parent: ["bullet"],
};

make.bullet_square = {
  parent: ["bullet"],
  shape: 4,
  rotation_controller: "spin",
  spin_rate: 3,
};

make.bullet_push = {
  parent: ["bullet"],
  density: 1,
  //shape: 4,
  //angle: 90,
  shape: 2,
  dimensions: { width: 0.2, height: 2, },
  fov: 6,
};

make.bullet_tower = {
  parent: ["bullet"],
  controller: "target",
  rotation_controller: "target",
  deco: 101,
  tower: true,
  show_health: true,
  show_time_left: true,
  fov: 18,
};

make.bullet_tower_basic = {
  parent: ["bullet_tower"],
  shoots: [shoots.t_basic],
};

make.bullet_trap = {
  parent: ["bullet"],
  tower: true,
  shape: 5,
  fov: 15,
};

make.bullet_trap_large = {
  parent: ["bullet"],
  tower: true,
  show_time_left: true,
  shape: 5,
  fov: 10,
};

make.bullet_trap_basic = {
  parent: ["bullet_tower"],
  shape: 5,
  shoots: [shoots.t_trap_basic],
};

make.bullet_launch = {
  parent: ["bullet"],
  shooting: true,
  deco: 101,
  shoots: [shoots.t_launch],
};