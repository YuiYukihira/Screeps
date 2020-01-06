import { Colony } from "Colony";
import _ from "lodash";

export abstract class Service {
  abstract getName(): string;
  creeps: Creep[];
  colony: Colony;

  constructor(colony: Colony) {
    this.creeps = _.get(colony.creepsByRole, this.getName(), []);
    this.colony = colony;
  }

  abstract runSpawnLogic(): void;
  abstract runCreepLogic(creep: Creep): void;

  run(): void {
    this.runSpawnLogic();
    for (let creep of this.creeps) {
      if (creep.isIdle) {
        this.runCreepLogic(creep);
      }
      creep.run();
    }
  }
}
