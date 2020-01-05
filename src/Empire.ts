import { Colony } from "Colony";

export class Empire {
  colonies: Colony[];
  constructor(colonies: Colony[]) {
    this.colonies = colonies;
  }

  run(): void {
    for (let colony of this.colonies) {
      colony.run();
    }
  }
}
