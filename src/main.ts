import { ErrorMapper } from "utils/ErrorMapper";

import 'creep-tasks/prototypes';
import { Empire } from "Empire";
import _ from "lodash";
import { Colony } from "Colony";
import { Traveler } from 'utils/Traveler';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
Traveler.toString();
export const loop = ErrorMapper.wrapLoop(() => {
  let empire;
  if (Memory.empire == null) {
    empire = buildEmpire();
  } else {
    empire = new Empire(Memory.empire);
  }
  empire.run();

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});

function buildEmpire(): Empire {
  let colonies = _.map(Game.spawns, spawn => {
    let room = spawn.room;
    let creeps = _.map(room.find<FIND_MY_CREEPS>(FIND_MY_CREEPS), c => c.name);
    let sources = _.map(room.find<FIND_SOURCES>(FIND_SOURCES), s => s.id);
    return { name: "Colony1", mainSpawn: spawn.id, mainRoom: room.name, expansionRooms: [], creeps: creeps, sources: sources, wishlist: [] }
  });
  return new Empire({ colonies: colonies, hostileRooms: [] });
}
