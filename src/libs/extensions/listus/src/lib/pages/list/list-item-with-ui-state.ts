import { IListItemBrief } from '@sneat/dto';

export interface IListItemWithUiState {
	readonly brief: IListItemBrief;
	readonly state: {
		isAdding?: boolean;
		isDeleting?: boolean;
		isChangingIsDone?: boolean;
		isReordering?: boolean;
	};
}
