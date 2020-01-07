import { Service } from "services/Service";
import _ from "lodash";
import { Tasks } from "creep-tasks/Tasks";

export class UpgradeService extends Service {
  getName() {
    return "upgrader";
  }

  runSpawnLogic(): void {
    if (this.creeps.length < 2) {
      this.colony.addToWishlist(
        {
          body: [WORK, MOVE, MOVE, CARRY],
          name: "Upgrader" + Game.time,
          memory: { role: this.getName(), colony: this.colony.name, task: null }
        },
        2
      );
    }
  }

  runCreepLogic(creep: Creep) {
    if (creep.carry.energy > 0) {
      creep.task = Tasks.upgrade(this.colony.mainRoom.controller!);
    } else {
      creep.task = Tasks.withdraw(this.colony.mainSpawn, RESOURCE_ENERGY);
    }
  }
}
