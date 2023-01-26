import { maketype } from "./make.ts";

export interface shoot_stats {
  type: string;
  size: number;
  reload: number;
  speed : number;
  spread: number;
  spreadv?: number;
  spreadsize?: number;
  damage: number;
  health: number;
  time: number;
  color?: number;
  friction?: number;
  recoil?: number;
  duration_reload?: number;
  delay?: number;
  target_type?: string;
  move?: boolean;
  always_shoot?: boolean;
  options?: maketype;
  parent?: shoot_stats;
  [key: string]: unknown;
}

const normal: shoot_stats = { type: "basic", reload: 50, size: 7, speed: 10, spread: 0.03, damage: 15, health: 10, time: 1.5, };


const basic: shoot_stats = { type: "basic", reload: 30, size: 10, speed: 5, spread: 0.05, damage: 15, health: 10, time: 3.0, };

const p_basic: shoot_stats = { type: "basic", reload: 40, size: 7, speed: 10, spread: 0.03, damage: 12, health: 10, time: 3.0, };
const p_fast: shoot_stats = { type: "basic", reload: 20, size: 5, speed: 7.5, spread: 0.05, damage: 7, health: 6, time: 2.0, };
const p_trap: shoot_stats = { type: "trap", reload: 10, size: 9, speed: 7.5, spreadv: 1, friction: 0.05, spread: 0.05, damage: 4, health: 5, time: 5.0, };

const ability_tower: shoot_stats = { type: "tower_basic", reload: 1000000, size: 12, speed: 5, friction: 0.05, spread: 0.04, damage: 12, health: 10, time: 10.0, };

const tower_basic: shoot_stats = { type: "basic", reload: 40, size: 5, speed: 7.5, spread: 0.02, damage: 8, health: 10, time: 2.0, };

export const shoots = {
  normal,
  basic,
  p_basic, p_fast, p_trap,
  ability_tower,
  tower_basic,
};