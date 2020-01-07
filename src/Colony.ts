import _, { Dictionary } from "lodash";
import { HarvestService } from "services/HarvestService";
import { UpgradeService } from "services/UpgradeService";
import { TransportService } from "services/TransportService";
import { BuilderService } from "services/BuilderService";

type wishlist = { priority: number, element: ProtoCreep }[];
export class Colony {
  private memory: ColonyMemory;

  harvestServices: HarvestService[];
  upgradeService: UpgradeService;
  transportService: TransportService;
  builderService: BuilderService;

  parkLocation: RoomPosition;

  constructor(memory: ColonyMemory) {
    this.memory = memory;

    this.harvestServices = _.map(this.sources, s => new HarvestService(this, _.get(this.creepsByRole, "harvester" + s.id, []), s));
    this.upgradeService = new UpgradeService(this, _.get(this.creepsByRole, "upgrader", []));
    this.transportService = new TransportService(this, _.get(this.creepsByRole, "transporter", []));
    let conSites = _.map(this.mainRoom.find(FIND_CONSTRUCTION_SITES), c => { return { priority: 0, element: c } });
    this.builderService = new BuilderService(this, _.get(this.creepsByRole, "builder", []), conSites);
    this.parkLocation = Game.flags["Park" + this.mainRoom.name].pos;
  }

  get name(): string {
    return this.memory.name;
  }

  set name(value: string) {
    this.memory.name = value;
  }

  get mainSpawn(): StructureSpawn {
    return Game.getObjectById<StructureSpawn>(this.memory.mainSpawn)!;
  }

  set mainSpawn(value: StructureSpawn) {
    this.memory.mainSpawn = value.id;
  }

  get mainRoom(): Room {
    return Game.rooms[this.memory.mainRoom];
  }

  set mainRoom(value: Room) {
    this.memory.mainRoom = value.name;
  }

  get expansionRooms(): Room[] {
    return _.map(this.memory.expansionRooms, r => Game.rooms[r]);
  }

  set expansionRooms(value: Room[]) {
    this.memory.expansionRooms = _.map(value, r => r.name);
  }

  get creeps(): Creep[] {
    return _.map(this.memory.creeps, c => Game.creeps[c]);
  }

  set creeps(value: Creep[]) {
    this.memory.creeps = _.map(value, c => c.name);
  }

  get sources(): Source[] {
    return _.map(this.memory.sources, s => Game.getObjectById<Source>(s)!);
  }

  set sources(value: Source[]) {
    this.memory.sources = _.map(value, s => s.id);
  }

  get wishlist(): wishlist {
    return this.memory.wishlist;
  }

  set wishlist(value: wishlist) {
    this.memory.wishlist = value;
  }

  get creepsByRole(): Dictionary<Creep[]> {
    return _.groupBy(this.creeps, c => c.memory.role);
  }

  run(): void {
    for (let harvestService of this.harvestServices) {
      harvestService.run();
    }
    this.upgradeService.run();
    this.transportService.run();
    this.builderService.run();

    if (this.wishlist.length > 0) {
      this.buildFromWishlist();
    }
  }

  private buildFromWishlist(): void {
    this.wishlist = _.sortBy(this.wishlist, e => e.priority);
    let proto = this.wishlist.shift()!.element;
    this.mainSpawn.spawnCreep(proto.body, proto.name, { memory: proto.memory });
  }

  addToWishlist(body: ProtoCreep, priority: number): boolean {
    if (this.wishlist.length >= 4) {
      return false;
    }
    this.wishlist.push({ priority: priority, element: body });
    return true;
  }
}
