import { Empire } from "Empire";
import { Colony } from "Colony";
import _ from "lodash";

export class Memory {
  serializeEmpire(empire: Empire): EmpireMemory {
    return { colonies: _.map(empire.colonies, this.serializeColony) };
  }

  serializeColony(colony: Colony): ColonyMemory {
    return {
      controller: colony.controller.id,
      mainRoom: colony.mainRoom.name,
      expansionRooms: _.map(colony.expansionRooms, i => i.name),
      creeps: _.map(colony.creeps, i => i.id),
      sources: _.map(colony.sources, i => i.id)
    };
  }

  deserializeEmpire(memory: EmpireMemory): Empire {
    let colonies = _.map(memory.colonies, this.deserializeColony);
    return new Empire(colonies);
  }

  deserializeColony(memory: ColonyMemory): Colony {
    let controller = Game.getObjectById<StructureController>(memory.controller)!;
    let mainRoom = Game.rooms[memory.mainRoom];
    let expansionRooms = _.map(memory.expansionRooms, i => Game.rooms[i]);
    let creeps = _.map(memory.creeps, i => Game.getObjectById<Creep>(i)!);
    let sources = _.map(memory.sources, i => Game.getObjectById<Source>(i)!);
    return new Colony(controller, mainRoom, expansionRooms, creeps, sources);
  }
}
