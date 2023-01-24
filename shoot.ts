import { maketype } from "./make.ts";

export interface shoot_stats {
  type: string;
  size: number;
  reload: number;
  speed : number;
  spread: number;
  spreadv?: number;
  damage: number;
  time: number;
  options?: maketype;
  parent?: shoot_stats;
  [key: string]: unknown;
}

export const shoots: Record<string, shoot_stats> = {};

shoots.default = { type: "basic", reload: 30, size: 10, speed: 5, spread: 0.04, damage: 3, time: 240, };


shoots.basic = { type: "basic", reload: 30, size: 10, speed: 5, spread: 0.04, damage: 3, time: 240, };