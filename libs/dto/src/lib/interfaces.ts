export interface IBriefAndID<Brief> {
	readonly id: string;
	readonly brief: Brief;
}

export interface IDtoAndID<Dto> {
	readonly id: string;
	readonly dto?: Dto | null;
}
