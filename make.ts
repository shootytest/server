import { _vectortype  } from "./math.ts";

export class maketype {
  parent?: string;
  fixed?: boolean;
  size?: number;
  shape?: number;
  speed?: number;
  density?: number;
  friction?: number;
  color?: number;
  health?: number;
  movement_controller?: string;
  rotation_controller?: string;
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
  health: 1,
};