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
  colony: string;
  service: {
    name: string;
    role: "HARVESTER" | "HAULER" | "UPGRADER" | "BUILDER";
    data?: {
      pair: string;
      pos: {
        x: number;
        y: number;
        r: string;
      };
    };
  };
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

interface PathfinderReturn {
  path: RoomPosition[];
  ops: number;
  cost: number;
  incomplete: boolean;
}

interface TravelToReturnData {
  nextPos?: RoomPosition;
  pathfinderReturn?: PathfinderReturn;
  state?: TravelState;
  path?: string;
}

interface TravelToOptions {
  ignoreRoads?: boolean;
  ignoreCreeps?: boolean;
  ignoreStructures?: boolean;
  preferHighway?: boolean;
  highwayBias?: number;
  allowHostile?: boolean;
  allowSK?: boolean;
  range?: number;
  obstacles?: { pos: RoomPosition }[];
  roomCallback?: (roomName: string, matrix: CostMatrix) => CostMatrix | boolean;
  routeCallback?: (roomName: string) => number;
  returnData?: TravelToReturnData;
  restrictDistance?: number;
  useFindRoute?: boolean;
  maxOps?: number;
  movingTarget?: boolean;
  freshMatrix?: boolean;
  offRoad?: boolean;
  stuckValue?: number;
  maxRooms?: number;
  repath?: number;
  route?: { [roomName: string]: boolean };
  ensurePath?: boolean;
}

interface TravelData {
  state: any[];
  path: string;
}

interface TravelState {
  stuckCount: number;
  lastCoord: Coord;
  destination: RoomPosition;
  cpu: number;
}

interface Creep {
  travelTo(destination: HasPos | RoomPosition, ops?: TravelToOptions): number;
}

type Coord = { x: number; y: number };
type HasPos = { pos: RoomPosition };
