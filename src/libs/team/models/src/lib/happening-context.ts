import { HappeningKind, HappeningType, IHappeningBrief, IHappeningDto, UiState } from '@sneat/dto';
import { ITeamContext, ITeamItemContext } from '@sneat/team/models';

export type IHappeningContext = ITeamItemContext<IHappeningBrief, IHappeningDto>;

export interface IHappeningWithUiState extends IHappeningContext {
	readonly state: UiState;
}

export function newEmptyHappeningContext(team: ITeamContext, type: HappeningType, kind: HappeningKind): IHappeningContext {
	const brief: IHappeningBrief = {
		id: '',
		type: type,
		kind: kind,
		title: '',
	};
	return {id: '', team, brief, dto: {...brief}};
}
