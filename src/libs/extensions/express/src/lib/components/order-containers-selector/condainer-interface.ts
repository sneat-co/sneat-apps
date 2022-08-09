import { ContainerType } from '../../dto';

export interface IContainer {
	// from IOrderContainer
	readonly id: string;
	readonly type: ContainerType;
	readonly number?: string;
	//
	checked?: boolean;
	grossKg?: number;
	pallets?: number;
}
