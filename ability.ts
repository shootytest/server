import { Matter } from "./matter.js";
import { Player } from "./player.ts";
import { shoots } from "./shoot.ts";

const Vector = Matter.Vector;

const use = (player: Player) => {
  switch (player.ability) {
    case "none": {
      break;
    }
    case "reload_boost": {
      if (player.health.use_ability(100)) {
        // reload boost mode on
        player.reload_boost_time = 60;
      }
      break;
    }
    case "speed_boost": {
      if (player.health.use_ability(100)) {
        // speed boost mode on
        player.speed_boost_time = 75;
        player.shoot_bullets(shoots.ability_speed_trail);
      }
      break;
    }
    case "speed": {
      const move_x = (player.controls.right ? 1 : 0) - (player.controls.left ? 1 : 0);
      const move_y = (player.controls.down ? 1 : 0) - (player.controls.up ? 1 : 0);
      if ((move_x !== 0 || move_y !== 0) && player.health.use_ability(2.5)) {
        // additional move
        player.move_player(Vector.create(move_x, move_y), 1.2);
      }
      break;
    }
    case "push": {
      if (player.health.use_ability(100)) {
        player.shoot_bullet(shoots.ability_push);
      }
      break;
    }
    case "tower_basic": {
      if (player.health.use_ability(100)) {
        player.shoot_bullet(shoots.ability_tower_basic);
      }
      break;
    }
    case "tower_place": {
      if (player.health.use_ability(100)) {
        player.shoot_bullet(shoots.ability_tower_place);
      }
      break;
    }
    case "octopus": {
      if (player.health.use_ability(100)) {
        player.shoot_bullets(shoots.ability_octopus);
      }
      break;
    }
    case "jellyfish": {
      if (player.health.use_ability(100)) {
        player.shoot_bullets(shoots.ability_jellyfish);
      }
      break;
    }
    case "heal": {
      if (!player.health.full && player.health.use_ability(20)) {
        player.health.heal_percent(0.05);
      }
      break;
    }
    case "heal_bulk": {
      if (!player.health.full && player.health.use_ability(100)) {
        player.health.heal_percent(0.5);
      }
      break;
    }
    default: {
      break;
    }
  }
};

const stats: Record<string, { capacity?: number, regen?: number, }> = {
  default: {
    capacity: 100,
    regen: 20,
  },
  speed: {
    regen: 25,
  },
  push: {
    regen: 55,
  },
  octopus: {
    regen: 40,
  },
  heal_bulk: {
    regen: 15,
  },
};

const set = (player: Player) => {
  const ab = player.ability;
  player.make({
    health: {
      ability_capacity: stats[ab]?.capacity || stats.default.capacity,
      ability_regen: stats[ab]?.regen || stats.default.regen,
    },
  });
};

export const ability = {
  use, stats, set,
};