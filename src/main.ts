import { ErrorMapper } from "utils/ErrorMapper";

import Tasks from "creep-tasks";
import { Empire } from "Empire";
import _ from "lodash";
import { Colony } from "Colony";
import { Mem } from "utils/Memory";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  let empire;
  if (Memory.empire == null) {
    empire = buildEmpire();
  } else {
    empire = Mem.deserializeEmpire(Memory.empire);
  }
  empire.run();
  Memory.empire = Mem.serializeEmpire(empire);

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
    let creeps = room.find(FIND_MY_CREEPS);
    let sources = room.find(FIND_SOURCES);
    return new Colony("Colony1", spawn, spawn.room, [], sources, []);
  });
  return new Empire(colonies);
}
