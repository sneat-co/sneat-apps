import { computed, Signal } from '@angular/core';
import {
	IIdAndBrief,
	IIdAndBriefWithSpaceRef,
	INavContext,
	ISpaceRef,
} from '@sneat/core';
import { IShortSpaceInfo, ISpaceBrief, ISpaceDbo } from '@sneat/dto';

export function zipMapBriefsWithIDs<Brief>(
	briefs?: Readonly<Record<string, Brief>>,
): readonly IIdAndBrief<Brief>[] {
	return briefs
		? Object.entries(briefs).map(([id, brief]) => ({ id, brief }))
		: [];
}

export function zipMapBriefsWithIDsAndSpaceRef<Brief>(
	space: ISpaceRef,
	briefs?: Readonly<Record<string, Brief>>,
): readonly IIdAndBriefWithSpaceRef<Brief>[] {
	return briefs
		? Object.entries(briefs).map(([id, brief]) => ({ id, brief, space }))
		: [];
}

export interface ISpaceContext
	extends ISpaceRef,
		INavContext<ISpaceBrief, ISpaceDbo> {
	// readonly type?: SpaceType;
	// readonly assets?: IAssetContext[]; // TODO: this should not be here
	// readonly contacts?: IContactContext[]; // TODO: this should not be here
}

export function computeSpaceRefFromSpaceContext(
	$space: Signal<ISpaceContext | undefined>,
) {
	return computed<ISpaceRef>(() => {
		const space = $space();
		return space?.type
			? { type: space?.type, id: space.id }
			: { id: space?.id || '' };
	});
}

export function computeSpaceIdFromSpaceRef($spaceRef: () => ISpaceRef) {
	return computed<string>(() => $spaceRef().id);
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
