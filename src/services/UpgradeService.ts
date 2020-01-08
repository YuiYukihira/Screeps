import { Service } from "services/Service";
import _ from "lodash";
import { Tasks } from "creep-tasks/Tasks";

export class UpgradeService extends Service {
  getName() {
    return "upgrade";
  }

  runSpawnLogic(): void {
    console.log("c.1");
    if (this.creeps.length < 2) {
      this.colony.addToWishlist(
        {
          body: [WORK, MOVE, MOVE, CARRY],
          name: "Upgrader" + Game.time,
          memory: { colony: this.colony.name, task: null, service: { name: this.getName(), role: "UPGRADER" } }
        },
        2
      );
    }
  }

  runCreepLogic(creep: Creep) {
    console.log("c.2");
    if (creep.carry.energy > 0) {
      creep.task = Tasks.upgrade(this.colony.mainRoom.controller!);
    } else {
      creep.task = Tasks.withdraw(this.colony.mainSpawn, RESOURCE_ENERGY);
    }
  }
}
