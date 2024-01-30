import { IIdAndBrief, INavContext, TeamType } from '@sneat/core';
import { IShortTeamInfo, ITeamBrief, ITeamDto } from '@sneat/dto';

export interface ITeamRef {
	readonly id: string;
	readonly type?: TeamType;
}

export function zipMapBriefsWithIDs<Brief>(
	briefs?: Readonly<Record<string, Brief>>,
): readonly IIdAndBrief<Brief>[] {
	return briefs
		? Object.keys(briefs).map((id) => ({ id, brief: briefs[id] }))
		: [];
}

export function zipMapDTOsWithIDs<DTO>(
	o?: Readonly<Record<string, DTO>>,
): readonly IIdAndBrief<DTO>[] {
	return o ? Object.keys(o).map((id) => ({ id, brief: o[id] })) : [];
}

export interface ITeamContext
	extends ITeamRef,
		INavContext<ITeamBrief, ITeamDto> {
	// readonly type?: TeamType;
	// readonly assets?: IAssetContext[]; // TODO: this should not be here
	// readonly contacts?: IContactContext[]; // TODO: this should not be here
}

export const teamContextFromBrief = (
	id: string,
	brief: ITeamBrief,
): ITeamContext => ({ id, type: brief.type, brief });

// export interface IContactContextWithBrief
// 	extends ITeamItemNavContext<IContactBrief, IContactDto> {
// 	brief: IContactBrief;
// 	parentContact?: IContactContext;
// }

export function createShortTeamInfoFromDto(team: ITeamContext): IShortTeamInfo {
	if (!team.type) {
		throw new Error('!team.type');
	}
	return {
		id: team.id,
		type: team.type,
		title: team?.dto?.title || team.brief?.title,
	};
}
