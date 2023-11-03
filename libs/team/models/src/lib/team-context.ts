import { IIdAndBrief, IIdAndDto, INavContext, TeamType } from '@sneat/core';
import {
	IAssetBrief,
	IAssetDtoBase,
	IDocumentAssetDto,
	IDocumentBrief,
	IListBrief,
	IListDto,
	IShortTeamInfo,
	ITeamBrief,
	ITeamDto,
	IVehicleAssetDto,
	ListType,
	IHappeningBrief,
} from '@sneat/dto';
import { ITeamItemNavContext } from './team-item-context';

export interface ITeamRef {
	readonly id: string;
	readonly type?: TeamType;
}

export function zipMapBriefsWithIDs<Brief>(
	briefs?: Readonly<{ [id: string]: Brief }>,
): readonly IIdAndBrief<Brief>[] {
	return briefs
		? Object.keys(briefs).map((id) => ({ id, brief: briefs[id] }))
		: [];
}

export function zipMapDTOsWithIDs<DTO>(
	o?: Readonly<{ [id: string]: DTO }>,
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

export interface ISchedulusTeamDto {
	recurringHappenings?: { [id: string]: IHappeningBrief };
}

export interface ISchedulusTeamDtoWithID extends IIdAndDto<ISchedulusTeamDto> {}

export const teamContextFromBrief = (
	id: string,
	brief: ITeamBrief,
): ITeamContext => ({ id, type: brief.type, brief });

export type IAssetContext<Dto extends IAssetDtoBase = IAssetDtoBase> =
	ITeamItemNavContext<IAssetBrief, Dto>;
export type IVehicleAssetContext = IAssetContext<IVehicleAssetDto>;
export type IDocumentAssetContext = ITeamItemNavContext<
	IDocumentBrief,
	IDocumentAssetDto
>;

// export interface IContactContextWithBrief
// 	extends ITeamItemNavContext<IContactBrief, IContactDto> {
// 	brief: IContactBrief;
// 	parentContact?: IContactContext;
// }

export interface IListKey {
	id: string;
	type: ListType;
}

export interface IListContext
	extends ITeamItemNavContext<IListBrief, IListDto> {
	type?: ListType;
}

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
