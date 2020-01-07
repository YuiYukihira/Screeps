import { Colony } from "Colony";
import _ from 'lodash';

export class Empire {
  private memory: EmpireMemory;
  colonies: Colony[];
  constructor(memory: EmpireMemory) {
    this.memory = memory;

    this.colonies = _.map(this.memory.colonies, cm => new Colony(cm));
  }

  run(): void {
    for (let colony of this.colonies) {
      colony.run();
    }
  }
}
