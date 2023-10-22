import { INavContext } from '@sneat/core';
import { IIdAndBrief, IIdAndBriefAndDto } from '@sneat/dto';
import { ITeamRef } from './team-context';

export interface ITeamItemContext<Brief, Dto> extends INavContext<Brief, Dto> {
	readonly team: ITeamRef;
}

export interface ITeamItemWithTeamRef<Brief, Dto>
	extends IIdAndBriefAndDto<Brief, Dto> {
	readonly team: ITeamRef;
}

export interface ITeamItemBriefWithTeamRef<Brief> extends IIdAndBrief<Brief> {
	readonly team: ITeamRef;
}

export function teamItemBriefWithTeamRefFromBrief<Brief>(
	team: ITeamRef,
	id: string,
	brief: Brief,
): ITeamItemBriefWithTeamRef<Brief> {
	return { id, brief, team };
}
