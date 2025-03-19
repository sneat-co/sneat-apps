import { IIdAndBrief, INavContext, SpaceType } from '@sneat/core';
import { IShortSpaceInfo, ISpaceBrief, ISpaceDbo } from '@sneat/dto';

export interface ISpaceRef {
	readonly id: string;
	readonly type?: SpaceType;
}

export function zipMapBriefsWithIDs<Brief>(
	briefs?: Readonly<Record<string, Brief>>,
): readonly IIdAndBrief<Brief>[] {
	return briefs
		? Object.entries(briefs).map(([id, brief]) => ({ id, brief }))
		: [];
}

export interface ISpaceContext
	extends ISpaceRef,
		INavContext<ISpaceBrief, ISpaceDbo> {
	// readonly type?: SpaceType;
	// readonly assets?: IAssetContext[]; // TODO: this should not be here
	// readonly contacts?: IContactContext[]; // TODO: this should not be here
}

export const spaceContextFromBrief = (
	id: string,
	brief: ISpaceBrief,
): ISpaceContext => ({ id, type: brief.type, brief });

// export interface IContactContextWithBrief
// 	extends ITeamItemNavContext<IContactBrief, IContactDto> {
// 	brief: IContactBrief;
// 	parentContact?: IContactContext;
// }

export function createShortSpaceInfoFromDbo(
	space: ISpaceContext,
): IShortSpaceInfo {
	if (!space.type) {
		throw new Error('!team.type');
	}
	return {
		id: space.id,
		type: space.type,
		title: space?.dbo?.title || space.brief?.title,
	};
}
