import { IIdAndDto } from '@sneat/core';
import { IWithRelatedOnly } from '@sneat/dto';
import { ITeamItemWithOptionalDto } from '@sneat/team-models';
import { IHappeningBrief } from './happening';

export interface ICalendarHappeningBrief
	extends IHappeningBrief,
		IWithRelatedOnly {}

export interface ICalendariumTeamDto {
	recurringHappenings?: { [id: string]: ICalendarHappeningBrief };
}

export interface ICalendariumTeamDtoWithID
	extends IIdAndDto<ICalendariumTeamDto> {}

export interface ISchedulusTeamContext
	extends ITeamItemWithOptionalDto<ICalendariumTeamDto> {}
