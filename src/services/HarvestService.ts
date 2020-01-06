import { Service } from "services/Service";
import _ from "lodash";
import Tasks from "creep-tasks";

export class HarvestService extends Service {
  getName() {
    return "harvester";
  }

  runSpawnLogic(): void {
    if (this.creeps.length < 4) {
      this.colony.addToWishlist(
        {
          body: [WORK, MOVE, CARRY],
          name: "Harvester" + Game.time,
          memory: { role: this.getName(), colony: this.colony.name, task: null }
        },
        0
      );
    }
  }

  runCreepLogic(creep: Creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      let source = _.sortBy(this.colony.sources, [(s: Source) => s.targetedBy.length])[0];
      creep.task = Tasks.harvest(source);
    } else {
      if (_.get(this.colony.creepsByRole, "transporter", []).length > 0) {
        creep.task = Tasks.drop(creep.pos, RESOURCE_ENERGY);
      } else {
        creep.task = Tasks.transfer(this.colony.mainSpawn, "energy");
      }
    }
  }
}
