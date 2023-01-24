
export interface map_shape {
  type: string;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  size: number;
  angle?: number;
  bouncy?: boolean;
  window?: boolean;
}

export interface map_zone {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface game_map {
  name: string;
  width: number;
  height: number;
  spawn?: map_zone[];
  shapes: map_shape[];
}

export const maps: Record<string, game_map> = { };

maps.empty = {
  name: "Empty",
  width: 300,
  height: 300,
  spawn: [
    { x: 0, y: 0, w: 0, h: 0, },
  ],
  shapes: [
  ],
}

maps.test = {
  name: "Test",
  width: 400,
  height: 400,
  spawn: [
    { x: -380, y: -380, w: 760, h: 760, },
    // { x: 0, y: 0, w: 0, h: 0, },
  ],
  shapes: [
    { type: "circle", x: 40, y: 240, size: 50, },
    { type: "circle", x: -120, y: -40, size: 40, },
    { type: "circle", x: 320, y: -280, size: 30, },
  ],
}