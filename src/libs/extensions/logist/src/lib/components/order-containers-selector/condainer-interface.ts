import { ContainerType } from '../../dto';

export interface IContainer {
	// from IOrderContainer
	readonly id: string;
	readonly type: ContainerType;
	readonly number?: string;
	readonly tasks?: readonly string[];
	//
	checked?: boolean;
}
