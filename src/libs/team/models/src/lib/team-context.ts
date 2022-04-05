import { INavContext } from '@sneat/core';
import {
	IAssetBrief,
	IAssetDto, IContactBrief,
	IContactDto,
	IMemberBrief,
	IMemberDto,
	ITeamBrief,
	ITeamDto,
	TeamType,
} from '@sneat/dto';
import { IScrumBrief, IScrumDto } from '@sneat/scrumspace/scrummodels';
import { ITeamItemContext } from './team-item-context';

export interface ITeamContext extends INavContext<ITeamBrief, ITeamDto> {
	readonly type?: TeamType;
	readonly assets?: IAssetContext[];
	readonly contacts?: IContactContext[];
};

export type IMemberContext = ITeamItemContext<IMemberBrief, IMemberDto>;
export type IAssetContext = ITeamItemContext<IAssetBrief, IAssetDto>;
export type IContactContext = ITeamItemContext<IContactBrief, IContactDto>;
export type IScrumContext = ITeamItemContext<IScrumBrief, IScrumDto>;
