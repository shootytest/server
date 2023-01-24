import { category, _collision_filter } from "./config.ts";
import { _vectortype  } from "./math.ts";
import { shoots, shoot_stats } from "./shoot.ts";

export class maketype {
  parent?: string[];
  fixed?: boolean;
  player?: boolean;
  wall?: boolean;
  blocks_sight?: boolean;
  bullet_deleter?: boolean;
  show_health?: boolean;
  size?: number;
  shape?: number;
  speed?: number;
  density?: number;
  friction?: number;
  restitution?: number;
  color?: number;
  health?: {
    capacity?: number;
    regen?: number;
    regen_time?: number;
  };
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

make.player = {
  player: true,
  rotation_controller: "player",
  size: 30,
  shape: 5,
  speed: 50,
  density: 0.001,
  friction: 0.1,
  color: 0,
  health: {
    capacity: 50,
  },
  show_health: true,
  collision_filter: category.thing,
};

make.player_shoot = {
  shoots: [shoots.basic],
}

make.wall = {
  fixed: true,
  wall: true,
  blocks_sight: true,
  bullet_deleter: true,
  color: 0,
  collision_filter: category.wall,
};

make.wall_bounce = {
  parent: ["wall"],
  bullet_deleter: false,
  restitution: 1,
  color: 1,
};

make.bullet = {
  bullet: true,
  player: false,
  friction: 0,
  density: 0.002,
  damage: 1,
  shape: 0,
  collision_filter: category.thing,
};