import { Service } from "services/Service";
import { Colony } from "Colony";
import _ from "lodash";
import Tasks from "creep-tasks";

export class HarvestService implements Service {
  name = "harvester";
  creeps: Creep[];
  colony: Colony;

  constructor(colony: Colony) {
    this.creeps = _.get(colony.creepsByRole, this.name);
    this.colony = colony;
  }

  run(): void {
    if (this.creeps.length < 4) {
      this.colony.addToWishlist(
        {
          body: [WORK, MOVE, CARRY],
          name: "Harvester" + Game.time,
          memory: { role: this.name, colony: this.colony.name, task: null }
        },
        1
      );
    }

    for (let creep of this.creeps) {
      if (creep.isIdle) {
        if (creep.carry.energy < creep.carryCapacity) {
          let source = _.sortBy(this.colony.sources, [(s: Source) => s.targetedBy.length])[0];
          creep.task = Tasks.harvest(source);
        } else {
          creep.task = Tasks.transfer(this.colony.mainSpawn, RESOURCE_ENERGY);
        }
      }
      creep.run();
    }
  }
}
