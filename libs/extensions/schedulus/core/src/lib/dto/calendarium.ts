import { IIdAndDto } from '@sneat/core';
import { IWithRelatedOnly } from '@sneat/dto';
import { ITeamItemWithOptionalDto } from '@sneat/team-models';
import { IHappeningBrief } from './happening';

export interface ICalendarHappeningBrief
	extends IHappeningBrief,
		IWithRelatedOnly {}

export interface ICalendariumTeamDto {
	recurringHappenings?: Record<string, ICalendarHappeningBrief>;
}

export type ICalendariumTeamDtoWithID = IIdAndDto<ICalendariumTeamDto>;

export type ISchedulusTeamContext =
	ITeamItemWithOptionalDto<ICalendariumTeamDto>;
