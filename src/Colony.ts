import _ from 'lodash';
import Tasks from 'creep-tasks';

export class Colony {
  mainSpawn: StructureSpawn;
  mainRoom: Room;
  expansionRooms: Room[];
  creeps: Creep[];
  sources: Source[];

  creepsByRole: { [role: string]: Creep[] };

  constructor(
    mainSpawn: StructureSpawn,
    mainRoom: Room,
    expansionRooms: Room[],
    creeps: Creep[],
    sources: Source[]
  ) {
    this.mainSpawn = mainSpawn;
    this.mainRoom = mainRoom;
    this.expansionRooms = expansionRooms;
    this.creeps = creeps;
    this.sources = sources;

    this.creepsByRole = _.groupBy(creeps, e => e.memory.role);
  }

  run(): void {
    if (this.creepsByRole["harvester"].length < 4) {
      this.mainSpawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time, { memory: { role: 'harverster', task: null } });
    } else if (this.creepsByRole["upgrader"].length < 2) {
      this.mainSpawn.spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time, { memory: { role: 'upgrader', task: null } });
    }

    for (let upgrader of this.creepsByRole["upgrader"]) {
      if (upgrader.isIdle) {
        RoleUpgrader.newTask(upgrader, this.mainRoom.controller!, this.mainSpawn);
      }
    }
    for (let harverster of this.creepsByRole["harvester"]) {
      if (harverster.isIdle) {
        RoleHarvester.newTask(harverster, this.sources);
      }
    }
  }
}


class RoleHarvester {
  static newTask(creep: Creep, sources: Source[]): void {
    if (creep.carry.energy < creep.carryCapacity) {
      let unattendedSource = _.filter(sources, s => s.targetedBy.length == 0)[0];
      if (unattendedSource) {
        creep.task = Tasks.harvest(unattendedSource);
      } else {
        creep.task = Tasks.harvest(sources[0]);
      }
    }
  }
}

class RoleUpgrader {
  static newTask(creep: Creep, controller: StructureController, spawn: StructureSpawn): void {
    if (creep.carry.energy > 0) {
      creep.task = Tasks.upgrade(controller);
    } else {
      creep.task = Tasks.withdraw(spawn, RESOURCE_ENERGY);
    }
  }
}
