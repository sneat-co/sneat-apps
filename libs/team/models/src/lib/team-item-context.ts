import {
	IIdAndBrief,
	IIdAndBriefAndDto,
	IIdAndOptionalBriefAndOptionalDto,
	IIdAndOptionalDto,
} from '@sneat/core';
import { ITeamRef } from './team-context';

export interface ITeamItemWithOptionalBriefAndOptionalDto<
	Brief,
	Dto extends Brief,
> extends IIdAndOptionalBriefAndOptionalDto<Brief, Dto> {
	readonly team: ITeamRef;
}

export interface ITeamItemWithOptionalDto<Dto> extends IIdAndOptionalDto<Dto> {
	readonly team: ITeamRef;
}

export type ITeamItemNavContext<
	Brief,
	Dto extends Brief,
> = ITeamItemWithOptionalBriefAndOptionalDto<Brief, Dto>;

export interface ITeamItemWithBriefAndDto<Brief, Dto extends Brief>
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
