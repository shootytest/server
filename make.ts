import { _vectortype  } from "./math.ts";
import { shoots, shoot_stats } from "./shoot.ts";

export class maketype {
  parent?: string[];
  fixed?: boolean;
  player?: boolean;
  wall?: boolean;
  blocks_sight?: boolean;
  bullet_deleter?: boolean;
  size?: number;
  shape?: number;
  speed?: number;
  density?: number;
  friction?: number;
  restitution?: number;
  color?: number;
  health?: number;
  health_capacity?: number;
  movement_controller?: string;
  rotation_controller?: string;
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
  shape: 0,
  speed: 50,
  density: 0.001,
  friction: 0.1,
  color: 0,
  health: 5,
  health_capacity: 5,
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
};

make.wall_bounce = {
  parent: ["wall"],
  bullet_deleter: false,
  restitution: 1,
  color: 1,
};

make.bullet = {
  friction: 0,
  density: 0.002,
  damage: 1,
  bullet: true,
  shape: 0,
};