export const config = {
  physics: {
    gravity_x: 0,
    gravity_y: 0,
    force_factor: 0.00005,
    recoil_factor: 50.0,
    friction_factor: 1.0,
    density_factor: 1.0,
    velocity_shoot_boost: 0.5,
  },
  game: {
    player_health: 5, // total health capacity
    player_regen: 0.5, // health per second
    player_regen_delay: 3, // in seconds
    respawn_time: 180,
    respawn_invincibility: 180,
    health_mult: 10,
    enemy_spawn_delay: 60,
    map_border_wall_thickness: 10,
  },
};

// collision categories

const category_group = {
  none: 0x0000,
  thing: 0x0001,
  wall: 0x0002,
  all: 0xFFFF,
};

export interface _collision_filter {
  group: number,
  category: number,
  mask: number,
}

export const category = {
  group: category_group,
  all: {
    group: 0,
    category: category_group.thing,
    mask: category_group.all,
  },
  none: {
    group: 0,
    category: category_group.thing,
    mask: category_group.none,
  },
  thing: {
    group: -1,
    category: category_group.thing,
    mask: category_group.all,
  },
  wall: {
    group: 0,
    category: category_group.wall,
    mask: category_group.all,
  },
};