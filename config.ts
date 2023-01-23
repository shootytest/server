export const config = {
  physics: {
    gravity_x: 0,
    gravity_y: 0,
    force_factor: 0.1,//0.00005,
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