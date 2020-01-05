// example declaration file - remove these and add your own custom typings

interface EmpireMemory {
  colonies: ColonyMemory[];
}

interface ColonyMemory {
  mainSpawn: string;
  mainRoom: string;
  expansionRooms: string[];
  creeps: string[];
  sources: string[];
}

// memory extension samples
interface CreepMemory {
  role: string;
}

interface Memory {
  empire: EmpireMemory | null;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
