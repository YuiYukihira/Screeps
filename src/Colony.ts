import _ from "lodash";
import Tasks from "creep-tasks";
import { HarvestService } from "services/HarvestService";
import { UpgradeService } from "services/UpgradeService";
import { TransportService } from "services/TransportService";

export class Colony {
  name: string;
  mainSpawn: StructureSpawn;
  mainRoom: Room;
  expansionRooms: Room[];
  creeps: Creep[];
  sources: Source[];
  wishlist: { priority: number; element: ProtoCreep }[];

  creepsByRole: { [role: string]: Creep[] };

  harvestService: HarvestService;
  upgradeService: UpgradeService;
  transportService: TransportService;

  constructor(
    name: string,
    mainSpawn: StructureSpawn,
    mainRoom: Room,
    expansionRooms: Room[],
    sources: Source[],
    wishlist: { priority: number; element: ProtoCreep }[]
  ) {
    this.name = name;
    this.mainSpawn = mainSpawn;
    this.mainRoom = mainRoom;
    this.expansionRooms = expansionRooms;
    this.creeps = _.filter(Game.creeps, c => c.memory.colony == this.name);
    this.sources = sources;
    this.wishlist = wishlist;

    this.creepsByRole = _.groupBy(this.creeps, e => e.memory.role);

    this.harvestService = new HarvestService(this);
    this.upgradeService = new UpgradeService(this);
    this.transportService = new TransportService(this);
  }

  run(): void {
    this.harvestService.run();
    this.upgradeService.run();
    this.transportService.run();

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
