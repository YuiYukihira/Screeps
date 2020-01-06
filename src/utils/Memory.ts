import { Empire } from "Empire";
import { Colony } from "Colony";
import _ from "lodash";

export class Mem {
  static serializeEmpire(empire: Empire): EmpireMemory {
    return { colonies: _.map(empire.colonies, this.serializeColony) };
  }

  static serializeColony(colony: Colony): ColonyMemory {
    return {
      name: colony.name,
      mainSpawn: colony.mainSpawn.id,
      mainRoom: colony.mainRoom.name,
      expansionRooms: _.map(colony.expansionRooms, i => i.name),
      creeps: _.map(colony.creeps, i => i.id),
      sources: _.map(colony.sources, i => i.id),
      wishlist: colony.wishlist
    };
  }

  static deserializeEmpire(memory: EmpireMemory): Empire {
    let colonies = _.map(memory.colonies, this.deserializeColony);
    return new Empire(colonies);
  }

  static deserializeColony(memory: ColonyMemory): Colony {
    let mainSpawn = Game.getObjectById<StructureSpawn>(memory.mainSpawn)!;
    let mainRoom = Game.rooms[memory.mainRoom];
    let expansionRooms = _.map(memory.expansionRooms, i => Game.rooms[i]);
    let sources = _.map(memory.sources, i => Game.getObjectById<Source>(i)!);
    return new Colony(
      memory.name,
      mainSpawn,
      mainRoom,
      expansionRooms,
      sources,
      memory.wishlist ? memory.wishlist : []
    );
  }
}