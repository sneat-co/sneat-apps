import { IIdAndDto } from '@sneat/core';
import { IHappeningBrief } from './happening';

export interface ISchedulusTeamDto {
	recurringHappenings?: { [id: string]: IHappeningBrief };
}

export interface ISchedulusTeamDtoWithID extends IIdAndDto<ISchedulusTeamDto> {}
