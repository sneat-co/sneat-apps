import { IListItemBrief, UiState } from '@sneat/dto';

export interface IListItemUiState extends UiState {
	isChangingIsDone?: boolean;
}

export interface IListItemWithUiState {
	readonly brief: IListItemBrief;
	readonly state: IListItemUiState;
}
