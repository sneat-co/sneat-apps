import { INavContext } from '@sneat/core';
import { IAssetBrief, IAssetDto, IMemberBrief, IMemberDto, ITeamBrief, ITeamDto, TeamType } from '@sneat/dto';
import { ITeamItemContext } from './team-item-context';

export interface ITeamContext extends INavContext<ITeamBrief, ITeamDto> {
	readonly type?: TeamType;
};
export type IMemberContext = ITeamItemContext<IMemberBrief, IMemberDto>;
export type IAssetContext = ITeamItemContext<IAssetBrief, IAssetDto>;
