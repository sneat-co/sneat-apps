export interface IIdAndBrief<Brief> {
	readonly id: string;
	readonly brief: Brief;
}

export interface IIdAndOptionalBrief<Brief> {
	readonly id: string;
	readonly brief?: Brief | null;
}

export interface IIdAndOptionalDbo<Dbo> {
	readonly id: string;
	readonly dbo?: Dbo | null;
}

export interface IIdAndDto<Dbo> {
	readonly id: string;
	readonly dbo: Dbo;
}

export interface IIdAndOptionalBriefAndOptionalDbo<Brief, Dbo extends Brief> {
	readonly id: string;
	readonly brief?: Brief | null;
	readonly dbo?: Dbo | null;
}

export interface IIdAndBriefAndOptionalDto<Brief, Dbo extends Brief> {
	readonly id: string;
	readonly brief: Brief;
	readonly dbo?: Dbo | null;
}

export interface IIdAndBriefAndDbo<Brief, Dbo extends Brief> {
	readonly id: string;
	readonly brief: Brief;
	readonly dbo: Dbo;
}
