import { Service } from "services/Service";
import _, { Dictionary } from "lodash";
import { Tasks } from "../creep-tasks/Tasks";
import { Colony } from "Colony";
import { connect } from "http2";

function inCol<T>(collection: T[], element: T): boolean {
  for (let i of collection) {
    if (element == i) {
      return true;
    }
  }
  return false;
}
export class HarvestService extends Service {
  getName() {
    return "harvest" + this.source.id;
  }

  getID(pos: RoomPosition): string {
    return pos.roomName + "X" + pos.x + "Y" + pos.y;
  }

  source: Source;
  pairs: Dictionary<{ harvester: Creep | undefined; hauler: Creep | undefined }>;

  constructor(colony: Colony, creeps: Creep[], source: Source) {
    super(colony, creeps);
    this.source = source;
    this.pairs = _.mapValues(
      _.groupBy<Creep>(creeps, (c: Creep) => c.memory.service.data!.pair),
      (creeps: Creep[], __: string) => {
        let harvester = _.first(_.filter(creeps, (c: Creep) => c && c.memory.service.role == "HARVESTER"));
        let hauler = _.first(_.filter(creeps, (c: Creep) => c && c.memory.service.role == "HAULER"));
        return { harvester: harvester, hauler: hauler };
      }
    );
    //console.log(_.map(this.creeps, c => c.name));
  }

  runSpawnLogic(): void {
    console.log("a");
    // find missing creeps from pairs.
    let ids = _.map(this.source.pos.availableNeighbors(), (p: RoomPosition) => {
      return { p: p, n: this.getID(p) };
    });
    _.forEach(this.pairs, (v: { hauler: Creep | undefined; harvester: Creep | undefined }, id: string) => {
      // is the hauler missing?
      let pos = _.find(ids, i => i.n == id)!.p;
      if (v.hauler == undefined) {
        this.colony.addToWishlist(
          {
            body: [CARRY, MOVE, MOVE],
            name: "hauler" + id,
            memory: {
              colony: this.colony.name,
              task: null,
              service: {
                name: this.getName(),
                role: "HAULER",
                data: { pair: id, pos: { r: pos.roomName, x: pos.x, y: pos.y } }
              }
            }
          },
          1
        );
        // is the harvester missing?
      } else if (v.harvester == undefined) {
        this.colony.addToWishlist(
          {
            body: [WORK, CARRY, MOVE],
            name: "harvester" + id,
            memory: {
              colony: this.colony.name,
              task: null,
              service: {
                name: this.getName(),
                role: "HARVESTER",
                data: { pair: id, pos: { r: pos.roomName, x: pos.x, y: pos.y } }
              }
            }
          },
          0
        );
      }
    });
    // create harvester and hauler for missing positions
    _.forEach(
      _.filter(ids, (id: { p: RoomPosition; n: string }) => !inCol(_.keys(this.pairs), id.n)),
      id => {
        this.colony.addToWishlist(
          {
            body: [CARRY, MOVE, MOVE],
            name: "hauler" + id.n,
            memory: {
              colony: this.colony.name,
              task: null,
              service: {
                name: this.getName(),
                role: "HAULER",
                data: { pair: id.n, pos: { r: id.p.roomName, x: id.p.x, y: id.p.y } }
              }
            }
          },
          1
        );
        this.colony.addToWishlist(
          {
            body: [WORK, CARRY, MOVE],
            name: "harvester" + id.n,
            memory: {
              colony: this.colony.name,
              task: null,
              service: {
                name: this.getName(),
                role: "HARVESTER",
                data: { pair: id.n, pos: { r: id.p.roomName, x: id.p.x, y: id.p.y } }
              }
            }
          },
          0
        );
      }
    );
  }

  runCreepLogic(creep: Creep) {
    console.log("b");
    console.log("c: " + creep.name);
    console.log(creep.memory.service);
    console.log(creep.memory.service.data);
    console.log(creep.memory.service.data!.pos);
    console.log(creep.memory.service.data!.pos.x);
    console.log(creep.memory.service.data!.pos.y);
    console.log(creep.memory.service.data!.pos.r);
    let p = new RoomPosition(
      creep.memory.service.data!.pos.x,
      creep.memory.service.data!.pos.y,
      creep.memory.service.data!.pos.r
    );
    console.log("b.1");
    console.log("p:" + p);
    if (creep.memory.service.role == "HARVESTER") {
      if (creep.store.getFreeCapacity() > 0) {
        console.log("harvest");
        creep.task = Tasks.harvest(this.source);
      } else {
        if (this.pairs[creep.memory.service.data!.pair].hauler) {
          console.log("drop");
          creep.task = Tasks.drop(creep.pos, RESOURCE_ENERGY);
        } else {
          console.log("dropoff");
          let dropofflocation = creep.pos.findClosestByRange<FIND_MY_STRUCTURES>(FIND_MY_STRUCTURES, {
            filter: s => {
              return (
                (s.structureType == STRUCTURE_EXTENSION ||
                  s.structureType == STRUCTURE_SPAWN ||
                  s.structureType == STRUCTURE_STORAGE) &&
                (s as StructureStorage | StructureSpawn | StructureExtension).store.getFreeCapacity(RESOURCE_ENERGY) > 0
              );
            }
          }) as StructureStorage | StructureSpawn | StructureExtension;
          console.log(dropofflocation);
          creep.task = Tasks.transfer(dropofflocation, RESOURCE_ENERGY);
        }
      }
    } else if (creep.memory.service.role == "HAULER") {
      if (creep.store.getUsedCapacity() > 0) {
        console.log("dropoff");
        let dropofflocation = creep.pos.findClosestByRange<FIND_MY_STRUCTURES>(FIND_MY_STRUCTURES, {
          filter: s => {
            return (
              (s.structureType == STRUCTURE_EXTENSION ||
                s.structureType == STRUCTURE_SPAWN ||
                s.structureType == STRUCTURE_STORAGE) &&
              (s as StructureStorage | StructureSpawn | StructureExtension).store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          }
        }) as StructureStorage | StructureSpawn | StructureExtension;
        console.log(dropofflocation);
        creep.task = Tasks.transfer(dropofflocation, RESOURCE_ENERGY);
      } else {
        console.log("pickup");
        let resource = creep.room.find<FIND_DROPPED_RESOURCES>(FIND_DROPPED_RESOURCES, {
          filter: r => {
            console.log(p);
            console.log(r.pos);
            return r.pos.x == p.x && r.pos.y == p.y && r.pos.roomName == p.roomName;
          }
        })[0];
        console.log(resource);
        if (!resource) {
          creep.task = Tasks.goTo(this.colony.parkLocation);
        } else {
          creep.task = Tasks.pickup(resource);
        }
      }
    }
    console.log("c");
  }
}
