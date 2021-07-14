import {IProjItemBrief} from './project';

export interface IPipeDefinition extends IProjItemBrief {
	readonly id: string;
	title: string;
}

export interface IValueToContextPipeDefinition extends IPipeDefinition {
	from: string;
	to: string;
}
