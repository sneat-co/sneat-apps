import { DeleteOperationState } from '@sneat/core';
import {
	HappeningKind,
	HappeningStatus,
	HappeningType,
	IHappeningBrief,
	IHappeningDto,
	IIdAndBrief,
	UiState,
} from '@sneat/dto';
import { ITeamContext } from './team-context';
import { ITeamItemContext } from './team-item-context';

export type IHappeningContext = ITeamItemContext<
	IHappeningBrief,
	IHappeningDto
>;

export type IHappeningBriefAndID = IIdAndBrief<IHappeningBrief>;

export interface IHappeningWithUiState extends IHappeningContext {
	readonly state: UiState;
}

export function newEmptyHappeningContext(
	team: ITeamContext,
	type: HappeningType,
	kind: HappeningKind,
	status: HappeningStatus,
): IHappeningBriefAndID {
	const brief: IHappeningBrief = {
		type,
		kind,
		status,
		title: '',
	};
	return { id: '', brief };
}

export type CancelOperationState =
	| 'cancelling-single'
	| 'cancelling-series'
	| 'canceled'
	| undefined;
export type RevokeCancellationOperationState =
	| 'revoking-cancellation'
	| undefined;

export type HappeningUIState =
	| DeleteOperationState
	| CancelOperationState
	| RevokeCancellationOperationState
	| undefined;
