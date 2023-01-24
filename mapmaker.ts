import { config } from "./config.ts";
import { make } from "./make.ts";
import { maps } from "./maps.ts";
import { _vectortype } from "./math.ts";
import { Matter } from "./matter.js";
import { Thing } from "./thing.ts";

const Vector = Matter.Vector;

export const mapmaker: {
  width?: number;
  height?: number;
  things?: Thing[];
  make?: (map_key: string) => void;
  [key: string]: unknown;
} = {};

mapmaker.width = 0;
mapmaker.height = 0;
mapmaker.things = [];

// const border_wall_thickness = config.game.map_border_wall_thickness;

const makeborder = (x1: number, y1: number, x2: number, y2: number) => {
  const x = (x1 + x2) / 2;
  const y = (y1 + y2) / 2;
  const wall = new Thing(Vector.create(x, y));
  wall.make(make.wall);
  wall.shape = 1;
  wall.size = 1;
  wall.angle = Math.atan2(x - x2, y2 - y);
  wall.segment = {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
  };
  wall.create();
  return wall;
}

mapmaker.make = (map_key: string) => {

  const M = maps[map_key];

  mapmaker.width = M.width;
  mapmaker.height = M.height;

  /*
  makeborder(0, M.height + thick, M.width + thick * 2, thick);
  makeborder(0, -M.height - thick, M.width + thick * 2, thick);
  makeborder(M.width + thick, 0, thick, M.height + thick * 2);
  makeborder(-M.width - thick, 0, thick, M.height + thick * 2);
  */

  makeborder(-M.width, -M.height, -M.width, M.height);
  makeborder(M.width, -M.height, M.width, M.height);
  makeborder(-M.width, -M.height, M.width, -M.height);
  makeborder(-M.width, M.height, M.width, M.height);

  for (const S of M.shapes) {
    const wall = new Thing(Vector.create(S.x || 0 , S.y || 0));
    // originally: new Thing(Vector.create((S.x || 0) * M.width, (S.y || 0) * M.height));
    wall.make(make.wall);
    if (S.bouncy) {
      wall.make(make.wall_bounce);
    }
    /*
    if (S.bulletblock) {
      wall.make(make.wall_bulletblock);
    } else if (S.playerblock) {
      wall.make(make.wall_playerblock);
    }
    */

    // shape
    if (S.type === "circle") {
      wall.shape = 0;
      wall.size = S.size;
      wall.angle = S.angle || 0;
    } else if (S.type === "square") {
      wall.shape = 4;
      wall.size = S.size;
      wall.angle = S.angle || 0;
    } else if (S.type === "line" && S.x2 != undefined && S.y2 != undefined) {
      const newx = (S.x + S.x2) / 2;
      const newy = (S.y + S.y2) / 2;
      wall.shape = 1;
      wall.size = 1;
      wall.position = Vector.create(newx, newy);
      wall.angle = Math.atan2(newx - S.x2, S.y2 - newy);
      wall.segment = {
        x1: S.x,
        y1: S.y,
        x2: S.x2,
        y2: S.y2,
      };
    }

    wall.create();

    mapmaker.things?.push(wall);
  }
  
}

mapmaker.remove = function(shape_index: number) {
  const thing = mapmaker.things?.at(shape_index);
  if (thing == undefined) return;
  thing.remove();
  // remove from the shapes list too
  const index = mapmaker.things?.indexOf(thing);
  if (index != null && index > -1) {
    mapmaker.things?.splice(index, 1);
  }
}

mapmaker.check_outside_map = function(position: _vectortype) {
  const w = mapmaker.width, h = mapmaker.height;
  if (w == undefined || h == undefined) return true;
  const b = config.game.map_border_wall_thickness;
  const x = position.x, y = position.y;
  return x > w - b || x < b - w || y > h - b || y < b - h;
}