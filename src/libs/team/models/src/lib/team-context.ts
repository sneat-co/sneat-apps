import { INavContext, TeamType } from '@sneat/core';
import {
	IAssetBrief,
	IAssetDto,
	IContactBrief,
	IContactDto,
	IDocumentBrief,
	IDocumentDto,
	IListBrief,
	IListDto,
	IMemberBrief,
	IMemberDto,
	IMemberGroupBrief,
	IMemberGroupDto,
	IPerson,
	IPersonBrief,
	IShortTeamInfo,
	ITeamBrief,
	ITeamDto,
	ListType,
} from '@sneat/dto';
import { ITeamItemContext, teamItemContextFromBrief } from './team-item-context';

export interface ITeamRef {
	readonly id: string;
	readonly type?: TeamType;
}

export interface ITeamContext extends ITeamRef, INavContext<ITeamBrief, ITeamDto> {
	// readonly type?: TeamType;
	readonly assets?: IAssetContext[]; // TODO: this should not be here
	readonly contacts?: IContactContext[]; // TODO: this should not be here
};

export const teamContextFromBrief = (brief: ITeamBrief): ITeamContext => ({ id: brief.id, type: brief.type, brief });

export type IMemberContext = ITeamItemContext<IMemberBrief, IMemberDto>;
export type IPersonContext = ITeamItemContext<IPersonBrief, IPerson>;
export type IMemberGroupContext = ITeamItemContext<IMemberGroupBrief, IMemberGroupDto>;
export type IAssetContext<Dto extends IAssetDto = IAssetDto> = ITeamItemContext<IAssetBrief, Dto>;
export type IDocumentContext = ITeamItemContext<IDocumentBrief, IDocumentDto>;

export interface IContactContext extends ITeamItemContext<IContactBrief, IContactDto> {
	parentContact?: IContactContext;
}

export function contactContextFromBrief(team: ITeamContext, brief: IContactBrief): IContactContext {
	return teamItemContextFromBrief(team, brief);
}

export interface IListKey {
	id: string;
	type: ListType;
}

export interface IListContext extends ITeamItemContext<IListBrief, IListDto> {
	type?: ListType;
}

export function createShortCommuneInfoFromDto(team: ITeamContext): IShortTeamInfo {
	if (!team.type) {
		throw new Error('!team.type');
	}
	return { id: team.id, title: team.brief?.title, type: team.type };
}

