// example declaration file - remove these and add your own custom typings

interface EmpireMemory {
  colonies: ColonyMemory[];
  hostileRooms: any;
}

interface ColonyMemory {
  name: string;
  mainSpawn: string;
  mainRoom: string;
  expansionRooms: string[];
  creeps: string[];
  sources: string[];
  wishlist: { priority: number; element: ProtoCreep }[];
}

// memory extension samples
interface CreepMemory {
  role: string;
  colony: string;
  _trav?: any;
}

interface RoomMemory {
  avoid: number;
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

interface ProtoCreep {
  memory: CreepMemory;
  name: string;
  body: BodyPartConstant[];
}
