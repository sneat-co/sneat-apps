import { DeleteOperationState } from '@sneat/core';
import { UiState } from '@sneat/dto';
import { ISpaceContext, ISpaceItemNavContext } from '@sneat/team-models';
import {
	HappeningKind,
	HappeningStatus,
	HappeningType,
	IHappeningBrief,
	IHappeningDbo,
} from '../dto/happening';

export type IHappeningContext = ISpaceItemNavContext<
	IHappeningBrief,
	IHappeningDbo
>;

export interface IHappeningWithUiState extends IHappeningContext {
	readonly state: UiState;
}

export function newEmptyHappeningContext(
	space: ISpaceContext,
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
	return { id: '', space, brief, dbo: { ...brief } };
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
