import { INavContext } from '@sneat/core';
import {
	IAssetBrief,
	IAssetDto,
	IContactBrief,
	IContactDto, IHappeningDto,
	IListBrief,
	IListDto,
	IMemberBrief,
	IMemberDto,
	IShortTeamInfo,
	ITeamBrief,
	ITeamDto,
	TeamType,
} from '@sneat/dto';
import { ITeamItemContext } from './team-item-context';

export interface ITeamContext extends INavContext<ITeamBrief, ITeamDto> {
	readonly type?: TeamType;
	readonly assets?: IAssetContext[];
	readonly contacts?: IContactContext[];
};

export type IMemberContext = ITeamItemContext<IMemberBrief, IMemberDto>;
export type IAssetContext<Dto extends IAssetDto = IAssetDto> = ITeamItemContext<IAssetBrief, Dto>;
export type IListContext = ITeamItemContext<IListBrief, IListDto>;
export type IDocumentContext = IAssetContext;
export type IContactContext = ITeamItemContext<IContactBrief, IContactDto>;
export function createShortCommuneInfoFromDto(team: ITeamContext): IShortTeamInfo {
	if (!team.type) {
		throw new Error('!team.type');
	}
	return { id: team.id, title: team.brief?.title, type: team.type };
}
