import { Service } from "services/Service";
import _ from "lodash";
import { Tasks } from "creep-tasks/Tasks";
import { Colony } from "Colony";

export class BuilderService extends Service {
  getName() {
    return "build";
  }
  wishlist: { priority: number; element: ConstructionSite }[];

  constructor(colony: Colony, creeps: Creep[], wishlist: { priority: number; element: ConstructionSite }[]) {
    super(colony, creeps);
    this.wishlist = wishlist;
  }

  runSpawnLogic(): void {
    if (this.creeps.length < 2) {
      this.colony.addToWishlist(
        {
          body: [WORK, MOVE, CARRY],
          name: "Builder" + Game.time,
          memory: { colony: this.colony.name, task: null, service: { name: this.getName(), role: "BUILDER" } }
        },
        3
      );
    }
  }

  runCreepLogic(creep: Creep) {
    if (this.wishlist.length > 0) {
      if (creep.carry.energy > 0) {
        this.wishlist = _.sortBy(this.wishlist, e => e.priority);
        let conSite = this.wishlist.shift()!.element;
        creep.task = Tasks.build(conSite);
      } else {
        creep.task = Tasks.withdraw(this.colony.mainSpawn, RESOURCE_ENERGY);
      }
    } else {
      creep.task = Tasks.goTo(this.colony.parkLocation);
    }
  }
}
