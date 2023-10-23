export interface IIdAndBrief<Brief> {
	readonly id: string;
	readonly brief: Brief;
}

export interface IIdAndOptionalBrief<Brief> {
	readonly id: string;
	readonly brief?: Brief | null;
}

export interface IIdAndOptionalDto<Dto> {
	readonly id: string;
	readonly dto?: Dto | null;
}

export interface IIdAndDto<Dto> {
	readonly id: string;
	readonly dto: Dto;
}

export interface IIdAndOptionalBriefAndOptionalDto<Brief, Dto extends Brief> {
	readonly id: string;
	readonly brief?: Brief | null;
	readonly dto?: Dto | null;
}

export interface IIdAndBriefAndOptionalDto<Brief, Dto extends Brief> {
	readonly id: string;
	readonly brief: Brief;
	readonly dto?: Dto | null;
}

export interface IIdAndBriefAndDto<Brief, Dto extends Brief> {
	readonly id: string;
	readonly brief: Brief;
	readonly dto: Dto;
}
