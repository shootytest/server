import { maketype } from "./make.ts";

export interface shoot_stats {
  parent?: shoot_stats;
  type?: string;
  size?: number;
  reload?: number;
  speed?: number;
  spread?: number;
  spreadv?: number;
  spreadsize?: number;
  damage?: number;
  health?: number;
  time?: number;
  color?: number;
  friction?: number;
  recoil?: number;
  duration_reload?: number;
  delay?: number;
  x?: number;
  y?: number;
  target_type?: string;
  move?: boolean;
  always_shoot?: boolean;
  options?: maketype;
  [key: string]: unknown;
}

const basic: shoot_stats = { type: "basic", reload: 30, size: 10, speed: 5, spread: 0.03, damage: 15, health: 10, time: 3.0, };

const p_basic: shoot_stats = { type: "basic", reload: 40, size: 7, speed: 10, spread: 0.015, damage: 12, health: 10, time: 3.0, };
const p_double: shoot_stats = { type: "basic", reload: 50, size: 6, speed: 9, spread: 0.02, damage: 8.5, health: 7.5, time: 2.5, };
const p_triple: shoot_stats = { type: "basic", reload: 60, size: 6, speed: 8.5, spread: 0.02, damage: 7, health: 5, time: 2.5, };
const p_fast: shoot_stats = { type: "basic", reload: 20, size: 5, speed: 7.5, spread: 0.025, damage: 7, health: 6, time: 2.0, };
const p_faster: shoot_stats = { type: "basic", reload: 10, size: 3.5, speed: 6.5, spread: 0.035, damage: 4, health: 3.5, time: 1.7, };
const p_large: shoot_stats = { type: "basic", reload: 70, size: 14, speed: 6, spread: 0.015, damage: 20, health: 16, time: 4.5, };
const p_launch: shoot_stats = { type: "launch", reload: 80, size: 12, speed: 4, spread: 0.015, damage: 18, health: 16, time: 5.0, };
const p_sniper: shoot_stats = { type: "basic", reload: 85, size: 6.5, speed: 17.5, spread: 0.005, damage: 25, health: 5, time: 4.0, };
const p_trap: shoot_stats = { type: "trap", reload: 30, size: 8, speed: 5, spreadv: 1, friction: 0.03, spread: 0.025, damage: 9, health: 10, time: 4.5, };
const p_trap_large: shoot_stats = { type: "trap_large", reload: 80, size: 20, speed: 0, spreadv: 0, friction: 1, spread: 0, damage: 30, health: 30, time: 7.0, };
const p_trap_t_basic: shoot_stats = { type: "trap_basic", reload: 120, size: 15, speed: 3, spreadv: 0.5, friction: 0.03, spread: 0.015, damage: 15, health: 20, time: 8.0, };

const ability_tower: shoot_stats = { type: "tower_basic", reload: 1000000, size: 12, speed: 5, friction: 0.05, spread: 0.02, damage: 15, health: 30, time: 10.0, };
const ability_octopus: shoot_stats[] = (() => {
  const result: shoot_stats[] = [];
  for (let i = 0; i < 8; i++) {
    result.push({ type: "basic", reload: 1000000, size: 10, speed: 3.5, spread: 0.005, damage: 7, health: 2, time: 6.0, angle: 45 * i, });
  }
  return result;
})();

const t_basic: shoot_stats = { type: "basic", reload: 40, size: 5, speed: 7.5, recoil: 0.1, spread: 0.01, damage: 8, health: 10, time: 2.0, };
const t_trap_basic: shoot_stats = { type: "basic", reload: 40, size: 7, speed: 7, recoil: 0.1, spread: 0.01, damage: 5, health: 5, time: 2.0, };
const t_launch: shoot_stats = { type: "basic", reload: 40, size: 5, speed: 6, recoil: 0.5, spread: 0.01, damage: 5, health: 5, time: 2.0, };

export const shoots = {
  basic,
  p_basic, 
  p_double, p_triple,
  p_fast, p_faster,
  p_large, p_launch,
  p_sniper,
  p_trap, p_trap_large, p_trap_t_basic,
  ability_tower, ability_octopus,
  t_basic, t_trap_basic, t_launch,
  // reload server
};