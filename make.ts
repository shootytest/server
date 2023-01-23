import { _vectortype  } from "./math.ts";

export const make: Record<string, {
  parent?: string;
  fixed?: boolean;
  size?: number;
  shape?: number;
  speed?: number;
  density?: number;
  friction?: number;
  color?: number;
  health?: number;
}> = {};

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
  [key: string]: unknown;
}

make.default = {
  // nothing here for now, all defaults should be in the Thing class.
};