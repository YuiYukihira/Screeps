import { Service } from "services/Service";
import _ from "lodash";
import { Tasks } from "../creep-tasks/Tasks";
import { Colony } from "Colony";

export class HarvestService extends Service {
  getName() {
    return "harvester" + this.source.id;
  }
  source: Source;
  harvestLocations: RoomPosition[];

  constructor(colony: Colony, creeps: Creep[], source: Source, harvestLocations?: RoomPosition[]) {
    super(colony, creeps);
    this.source = source;
    if (harvestLocations) {
      this.harvestLocations = harvestLocations;
    } else {
      this.harvestLocations = source.pos.availableNeighbors();
    }
  }

  runSpawnLogic(): void {
    if (this.creeps.length < this.harvestLocations.length) {
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
      creep.task = Tasks.harvest(this.source);
    } else {
      if (this.colony.transportService.creeps.length > 0) {
        creep.task = Tasks.drop(creep.pos, RESOURCE_ENERGY);
      } else {
        creep.task = Tasks.transfer(this.colony.mainSpawn, RESOURCE_ENERGY);
      }
    }
  }
}
