import { Colony } from "Colony";
import _ from "lodash";

export abstract class Service {
  abstract getName(): string;
  creeps: Creep[];
  colony: Colony;
  memory: any;

  constructor(colony: Colony, creeps: Creep[]) {
    this.creeps = creeps;
    this.colony = colony;
  }

  abstract runSpawnLogic(): void;
  abstract runCreepLogic(creep: Creep): void;

  run(): void {
    console.log(this.getName() + " start");
    this.runSpawnLogic();
    for (let creep of this.creeps) {
      if (creep.isIdle) {
        this.runCreepLogic(creep);
      }
      creep.run();
    }
    console.log(this.getName() + " end");
  }
}
