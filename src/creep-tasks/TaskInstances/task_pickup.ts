import { Task } from '../Task';
import _ from 'lodash';

export type pickupTargetType = Resource;

export class TaskPickup extends Task {

	static taskName = 'pickup';
	get target(): pickupTargetType { return super.target as pickupTargetType; }

	constructor(target: pickupTargetType, options = {} as TaskOptions) {
		super(TaskPickup.taskName, target, options);
		this.settings.oneShot = true;
	}

	isValidTask() {
		return _.sum(this.creep.carry.getUsedCapacity) < this.creep.carryCapacity;
	}

	isValidTarget() {
		return this.target && this.target.amount > 0;
	}

	work() {
		return this.creep.pickup(this.target);
	}
}
