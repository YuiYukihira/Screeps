export class Colony {
  controller: StructureController;
  mainRoom: Room;
  expansionRooms: Room[];
  creeps: Creep[];
  sources: Source[];

  creepsByRole: { [role: string]: Creep[] };

  constructor(
    controller: StructureController,
    mainRoom: Room,
    expansionRooms: Room[],
    creeps: Creep[],
    sources: Source[]
  ) {
    this.controller = controller;
    this.mainRoom = mainRoom;
    this.expansionRooms = expansionRooms;
    this.creeps = creeps;
    this.sources = sources;

    // TODO: initialize creepsByRole
  }
  // TODO: add run method to add tasks to idle creeps
}
