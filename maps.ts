
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
    { type: "circle", x: 0, y: 0, size: 100, bouncy: true, },
    { type: "circle", x: 0, y: -300, size: 50, bouncy: true, },
    { type: "circle", x: 0, y: 300, size: 50, bouncy: true, },
    { type: "circle", x: -300, y: 0, size: 50, bouncy: true, },
    { type: "circle", x: 300, y: 0, size: 50, bouncy: true, },
    { type: "circle", x: -300, y: -300, size: 50, bouncy: true, },
    { type: "circle", x: 300, y: -300, size: 50, bouncy: true, },
    { type: "circle", x: -300, y: 300, size: 50, bouncy: true, },
    { type: "circle", x: 300, y: 300, size: 50, bouncy: true, },
    // corridor
    { type: "line", x: 200, y: -760, x2: 760, y2: -760, },

    { type: "line", x: 760, y: -760, x2: 760, y2: -250, },
    { type: "line", x: 760, y: -250, x2: 760, y2: 250, window: true, },
    { type: "line", x: 760, y: -60, x2: 760, y2: 60, },
    { type: "line", x: 760, y: 250, x2: 760, y2: 760, },

    { type: "line", x: -760, y: 760, x2: -250, y2: 760, },
    { type: "line", x: -250, y: 760, x2: 250, y2: 760, window: true, },
    { type: "line", x: -60, y: 760, x2: 60, y2: 760, },
    { type: "line", x: 250, y: 760, x2: 760, y2: 760, },

    { type: "line", x: -760, y: 760, x2: -760, y2: -140, },
    // debug...
    /*
    { type: "line", x: -800, y: -800, x2: -1200, y2: -800 },
    { type: "line", x: -800, y: -800, x2: -800, y2: -1200 },
    */
  ],
};

maps.hello = {
  name: "Hello",
  width: 500,
  height: 500,
  spawn: [
    { x: -320, y: 200, w: 120, h: 120, },
    { x: 200, y: -320, w: 120, h: 120, },
    // { x: 0, y: 0, w: 0, h: 0, },
  ],
  shapes: [
    // center walls
    /*
    { type: "line", x: 60, y: -120, x2: 60, y2: 60, },
    { type: "line", x: 120, y: 60, x2: -60, y2: 60, },
    { type: "line", x: -60, y: 120, x2: -60, y2: -60, },
    { type: "line", x: -120, y: -60, x2: 60, y2: -60, },
    */
    { type: "circle", x: -160, y: 40, size: 60, bouncy: true, },
    { type: "circle", x: 40, y: -160, size: 60, bouncy: true, },
    { type: "circle", x: -120, y: -120, size: 40, bouncy: true, },
    { type: "circle", x: 40, y: 40, size: 40, bouncy: true, },

    // corridor
    { type: "line", x: 240, y: -380, x2: 380, y2: -380, },
    { type: "line", x: 380, y: -380, x2: 380, y2: -60, },
    { type: "line", x: 380, y: -60, x2: 380, y2: 120, window: true, },
    { type: "line", x: 380, y: 120, x2: 380, y2: 380, },

    { type: "line", x: -240, y: 380, x2: -380, y2: 380, },
    { type: "line", x: -380, y: 380, x2: -380, y2: 60, },
    { type: "line", x: -380, y: 60, x2: -380, y2: -120, window: true, },
    { type: "line", x: -380, y: -120, x2: -380, y2: -380, },
    // debug...
    /*
    { type: "line", x: -800, y: -800, x2: -1200, y2: -800 },
    { type: "line", x: -800, y: -800, x2: -800, y2: -1200 },
    */
  ],
};