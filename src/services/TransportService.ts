import { Service } from "services/Service";
import _ from "lodash";
import { Tasks } from "creep-tasks/Tasks";

export class TransportService extends Service {
  getName() {
    return "transporter";
  }

  runSpawnLogic(): void {
    if (this.creeps.length < 4) {
      this.colony.addToWishlist(
        {
          body: [MOVE, MOVE, CARRY],
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
      if (this.colony.mainSpawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        creep.task = Tasks.transfer(this.colony.mainSpawn, RESOURCE_ENERGY);
      } else {
        let extensions = this.colony.mainRoom.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } });
        let available = _.filter(extensions, (e: StructureExtension) => e.store.getFreeCapacity() > 0) as StructureExtension[];
        if (available.length > 0) {
          creep.task = Tasks.transfer(available[0], RESOURCE_ENERGY);
        }
      }
    }
  }
}
