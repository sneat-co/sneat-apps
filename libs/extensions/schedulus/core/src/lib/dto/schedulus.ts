import { IIdAndDto } from '@sneat/core';
import { ITeamItemWithOptionalDto } from '@sneat/team-models';
import { IHappeningBrief } from './happening';

export interface ISchedulusTeamDto {
	recurringHappenings?: { [id: string]: IHappeningBrief };
}

export interface ISchedulusTeamDtoWithID extends IIdAndDto<ISchedulusTeamDto> {}

export interface ISchedulusTeamContext
	extends ITeamItemWithOptionalDto<ISchedulusTeamDto> {}
