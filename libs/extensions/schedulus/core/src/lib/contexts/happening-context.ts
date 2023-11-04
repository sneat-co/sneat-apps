import { DeleteOperationState } from '@sneat/core';
import { UiState } from '@sneat/dto';
import { ITeamContext, ITeamItemNavContext } from '@sneat/team-models';
import {
	HappeningKind,
	HappeningStatus,
	HappeningType,
	IHappeningBrief,
	IHappeningDto,
} from '../';

export type IHappeningContext = ITeamItemNavContext<
	IHappeningBrief,
	IHappeningDto
>;

export interface IHappeningWithUiState extends IHappeningContext {
	readonly state: UiState;
}

export function newEmptyHappeningContext(
	team: ITeamContext,
	type: HappeningType,
	kind: HappeningKind,
	status: HappeningStatus,
): IHappeningContext {
	const brief: IHappeningBrief = {
		type,
		kind,
		status,
		title: '',
	};
	return { id: '', team, brief, dto: { ...brief } };
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
