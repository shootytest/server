
export interface map_shape {
  type: string;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  size?: number;
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
  width: 1000,
  height: 1000,
  spawn: [
    { x: -980, y: -980, w: 120, h: 120, },
    // { x: 0, y: 0, w: 0, h: 0, },
  ],
  shapes: [
    // spawn
    { type: "line", x: -840, y: -840, x2: -160, y2: -840, },
    { type: "line", x: -840, y: -840, x2: -840, y2: -500, },
    { type: "line", x: -1000, y: -360, x2: -500, y2: -360, },
    { type: "line", x: 0, y: -1000, x2: 0, y2: -500, },
    { type: "square", x: -500, y: -680, size: 60, },
    // center walls
    { type: "line", x: -500, y: -360, x2: -500, y2: 500, },
    { type: "line", x: 500, y: -500, x2: 500, y2: 360, },
    { type: "line", x: -500, y: -500, x2: 360, y2: -500, },
    { type: "line", x: -360, y: 500, x2: 500, y2: 500, },
    // 9 circles in center
    { type: "circle", x: 0, y: 0, size: 100, },
    { type: "circle", x: 0, y: -300, size: 50, },
    { type: "circle", x: 0, y: 300, size: 50, },
    { type: "circle", x: -300, y: 0, size: 50, },
    { type: "circle", x: 300, y: 0, size: 50, },
    { type: "circle", x: -300, y: -300, size: 50, },
    { type: "circle", x: 300, y: -300, size: 50, },
    { type: "circle", x: -300, y: 300, size: 50, },
    { type: "circle", x: 300, y: 300, size: 50, },
    // corridor
    { type: "line", x: 200, y: -760, x2: 760, y2: -760, },
    { type: "line", x: 760, y: -760, x2: 760, y2: 760, },
    { type: "line", x: 760, y: 760, x2: -760, y2: 760, },
    { type: "line", x: -760, y: 760, x2: -760, y2: -140, },
  ],
}