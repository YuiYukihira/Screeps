import { Service } from "services/Service";
import _ from "lodash";
import Tasks from "creep-tasks";

export class TransportService extends Service {
  getName() {
    return "transporter";
  }

  runSpawnLogic(): void {
    if (this.creeps.length < 4) {
      this.colony.addToWishlist(
        {
          body: [MOVE, CARRY],
          name: "Transporter" + Game.time,
          memory: { role: this.getName(), colony: this.colony.name, task: null }
        },
        1
      );
    }
  }

  runCreepLogic(creep: Creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      let resource = this.colony.mainRoom.find(FIND_DROPPED_RESOURCES, {
        filter: { resourceType: RESOURCE_ENERGY }
      })[0];
      creep.task = Tasks.pickup(resource);
    } else {
      creep.task = Tasks.transfer(this.colony.mainSpawn, RESOURCE_ENERGY);
    }
  }
}
