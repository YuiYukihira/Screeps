import { Colony } from "Colony";

export class Empire {
  colonies: Colony[];
  constructor(colonies: IColony[]) {
    this.colonies = colonies;
  }
}
