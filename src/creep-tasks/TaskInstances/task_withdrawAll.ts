import { Task } from '../Task';
import _ from 'lodash';


export type withdrawAllTargetType = StructureStorage | StructureTerminal | StructureContainer | Tombstone;

export class TaskWithdrawAll extends Task {

	static taskName = 'withdrawAll';
	target: withdrawAllTargetType;

	constructor(target: withdrawAllTargetType, options = {} as TaskOptions) {
		super(TaskWithdrawAll.taskName, target, options);
		this.target = target;
	}

	isValidTask() {
		return (_.sum(this.creep.carry.getUsedCapacity) < this.creep.carryCapacity);
	}

	isValidTarget() {
		return _.sum(this.target.store.getUsedCapacity) > 0;
	}

	work() {
		for (let resourceType in this.target.store) {
			let amountInStore = this.target.store[<ResourceConstant>resourceType] || 0;
			if (amountInStore > 0) {
				return this.creep.withdraw(this.target, <ResourceConstant>resourceType);
			}
		}
		return -1;
	}
}
