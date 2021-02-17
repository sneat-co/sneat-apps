export interface IPipeDefinition {
	readonly id: string;
	title: string;
}

export interface IValueToContextPipeDefinition extends IPipeDefinition {
	from: string;
	to: string;
}
