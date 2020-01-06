import { Service } from "services/Service";
import { Colony } from "Colony";
import _ from "lodash";
import Tasks from "creep-tasks";

export class UpgradeService implements Service {
  name = "upgrader";
  creeps: Creep[];
  colony: Colony;

  constructor(colony: Colony) {
    this.creeps = _.get(colony.creepsByRole, this.name);
    this.colony = colony;
  }

  run(): void {
    if (this.creeps.length < 2) {
      this.colony.addToWishlist(
        {
          body: [WORK, MOVE, CARRY],
          name: "Upgrader" + Game.time,
          memory: { role: this.name, colony: this.colony.name, task: null }
        },
        2
      );
    }

    for (let creep of this.creeps) {
      if (creep.isIdle) {
        if (creep.carry.energy > 0) {
          creep.task = Tasks.upgrade(this.colony.mainRoom.controller!);
        } else {
          creep.task = Tasks.withdraw(this.colony.mainSpawn, RESOURCE_ENERGY);
        }
      }
      creep.run();
    }
  }
}
