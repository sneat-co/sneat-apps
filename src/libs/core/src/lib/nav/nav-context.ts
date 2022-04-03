export interface INavContext<Brief, Dto> {
	readonly id: string;
	readonly brief?: Brief;
	readonly dto?: Dto | null;
}
