import { IIdAndOptionalBriefAndOptionalDbo } from '../';

export type TeamItem = 'happening' | 'contact' | 'document' | 'asset' | 'list';

export type DeleteOperationState = 'deleting' | 'deleted' | undefined;

export type INavContext<
	Brief,
	Dto extends Brief,
> = IIdAndOptionalBriefAndOptionalDbo<Brief, Dto>;

// export interface INavContext<Brief, Dto> {
// 	readonly id: string;
// 	readonly brief?: Brief | null;
// 	readonly dto?: Dto | null;
// }
