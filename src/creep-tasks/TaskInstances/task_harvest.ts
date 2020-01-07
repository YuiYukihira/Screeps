import { Task } from '../Task';
import { deref } from '../utilities/helpers';
import _ from 'lodash';

export type harvestTargetType = Source | Mineral;

function isSource(obj: Source | Mineral): obj is Source {
	return (<Source>obj).energy != undefined;
}

export class TaskHarvest extends Task {

	static taskName = 'harvest';
	get target(): harvestTargetType { return super.target as harvestTargetType; }

	constructor(target: harvestTargetType, options = {} as TaskOptions) {
		super(TaskHarvest.taskName, target, options);
	}

	isValidTask() {
		return _.sum(this.creep.carry.getUsedCapacity) < this.creep.carryCapacity;
	}

	isValidTarget() {
		// if (this.target && (this.target instanceof Source ? this.target.energy > 0 : this.target.mineralAmount > 0)) {
		// 	// Valid only if there's enough space for harvester to work - prevents doing tons of useless pathfinding
		// 	return this.target.pos.availableNeighbors().length > 0 || this.creep.pos.isNearTo(this.target.pos);
		// }
		// return false;
		if (isSource(this.target)) {
			return this.target.energy > 0;
		} else {
			return this.target.mineralAmount > 0;
		}
	}

	work() {
		return this.creep.harvest(this.target);
	}
}

