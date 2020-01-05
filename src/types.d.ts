// example declaration file - remove these and add your own custom typings

interface EmpireMemory {
  colonies: ColonyMemory[];
}

interface ColonyMemory {
  controller: string;
  mainRoom: string;
  expansionRooms: string[];
  creeps: string[];
  sources: string[];
}

// memory extension samples
interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
}

interface Memory {
  empire: EmpireMemory;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

// Types
interface IColony {
  controller: StructureController;
  mainRoom: Room;
  expansionRooms: Room[];
}
