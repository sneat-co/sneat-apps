import { INavContext } from '@sneat/core';
import {
	IAssetBrief,
	IAssetDto,
	IContactBrief,
	IContactDto,
	IHappeningBrief,
	IHappeningDto,
	IListBrief,
	IListDto,
	IMemberBrief,
	IMemberDto,
	IMemberGroupBrief,
	IMemberGroupDto,
	IShortTeamInfo,
	ITeamBrief,
	ITeamDto,
	TeamType,
} from '@sneat/dto';
import { ITeamItemContext } from './team-item-context';

export interface ITeamRef {
	readonly id: string;
	readonly type?: TeamType;
}

export interface ITeamContext extends ITeamRef, INavContext<ITeamBrief, ITeamDto> {
	// readonly type?: TeamType;
	readonly assets?: IAssetContext[];
	readonly contacts?: IContactContext[];
};

export type IMemberContext = ITeamItemContext<IMemberBrief, IMemberDto>;
export type IMemberGroupContext = ITeamItemContext<IMemberGroupBrief, IMemberGroupDto>;
export type IAssetContext<Dto extends IAssetDto = IAssetDto> = ITeamItemContext<IAssetBrief, Dto>;
export type IListContext = ITeamItemContext<IListBrief, IListDto>;
export type IDocumentContext = IAssetContext;
export type IContactContext = ITeamItemContext<IContactBrief, IContactDto>;
export type IHappeningContext = ITeamItemContext<IHappeningBrief, IHappeningDto>;
export type IRecurringContext = ITeamItemContext<IHappeningBrief, IHappeningDto>;

export function createShortCommuneInfoFromDto(team: ITeamContext): IShortTeamInfo {
	if (!team.type) {
		throw new Error('!team.type');
	}
	return { id: team.id, title: team.brief?.title, type: team.type };
}
