import { IIdAndOptionalBriefAndOptionalDbo } from '../';

export type SpaceItem = 'happening' | 'contact' | 'document' | 'asset' | 'list';

export type DeleteOperationState = 'deleting' | 'deleted' | undefined;

export type INavContext<
	Brief,
	Dbo extends Brief,
> = IIdAndOptionalBriefAndOptionalDbo<Brief, Dbo>;

// export interface INavContext<Brief, Dto> {
// 	readonly id: string;
// 	readonly brief?: Brief | null;
// 	readonly dto?: Dto | null;
// }
