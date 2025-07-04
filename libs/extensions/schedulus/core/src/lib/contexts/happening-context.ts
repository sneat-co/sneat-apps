import { DeleteOperationState } from '@sneat/core';
import { UiState } from '@sneat/dto';
import { ISpaceContext, ISpaceItemNavContext } from '@sneat/space-models';
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
	console.log('newEmptyHappeningContext', space, kind, status, kind);
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
	| 'cancelling-adjustment'
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
