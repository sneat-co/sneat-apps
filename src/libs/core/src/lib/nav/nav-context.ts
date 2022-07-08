export type TeamItem = 'happening' | 'contact' | 'document' | 'asset' | 'list';

export type DeleteOperationState = 'deleting' | 'deleted' | undefined;

export interface INavContext<Brief extends {id: string}, Dto> {
	readonly id: string;
	readonly brief?: Brief | null;
	readonly dto?: Dto | null;
}
