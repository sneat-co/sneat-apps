export interface IIdAndBrief<Brief> {
	readonly id: string;
	readonly brief: Brief;
}

export interface IIdAndOptionalBrief<Brief> {
	readonly id: string;
	readonly brief?: Brief | null;
}

export interface IIdAndOptionalDto<Dbo> {
	readonly id: string;
	readonly dto?: Dbo | null;
}

export interface IIdAndDto<Dbo> {
	readonly id: string;
	readonly dto: Dbo;
}

export interface IIdAndOptionalBriefAndOptionalDbo<Brief, Dbo extends Brief> {
	readonly id: string;
	readonly brief?: Brief | null;
	readonly dto?: Dbo | null;
}

export interface IIdAndBriefAndOptionalDto<Brief, Dbo extends Brief> {
	readonly id: string;
	readonly brief: Brief;
	readonly dto?: Dbo | null;
}

export interface IIdAndBriefAndDto<Brief, Dbo extends Brief> {
	readonly id: string;
	readonly brief: Brief;
	readonly dto: Dbo;
}
