import { config } from "./config.ts";
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
    case "tower_basic": {
      if (player.health.use_ability(100)) {
        player.shoot_bullet(shoots.ability_tower);
      }
      break;
    }
    case "octopus": {
      if (player.health.use_ability(100)) {
        player.shoot_bullets(shoots.ability_octopus);
      }
      break;
    }
    case "heal": {
      if (!player.health.full && player.health.use_ability(25)) {
        player.health.heal_percent(0.1);
      }
      break;
    }
    case "heal_bulk": {
      if (!player.health.full && player.health.use_ability(100)) {
        player.health.heal_percent(0.8);
      }
      break;
    }
    default: {
      break;
    }
  }
};

const stats: Record<string, { capacity?: number, regen?: number, }> = {
  speed: {
    regen: 25,
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
      ability_capacity: stats[ab]?.capacity || config.game.player_ability_capacity,
      ability_regen: stats[ab]?.regen || config.game.player_ability_regen,
    }
  });
};

export const ability = {
  use, stats, set,
};