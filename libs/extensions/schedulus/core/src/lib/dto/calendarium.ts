import { IIdAndDto } from '@sneat/core';
import { IWithRelatedOnly } from '@sneat/dto';
import { ISpaceItemWithOptionalDbo } from '@sneat/team-models';
import { IHappeningBrief } from './happening';

export interface ICalendarHappeningBrief
	extends IHappeningBrief,
		IWithRelatedOnly {}

export interface ICalendariumSpaceDbo {
	readonly recurringHappenings?: Record<string, ICalendarHappeningBrief>;
}

export type ICalendariumSpaceDboWithID = IIdAndDto<ICalendariumSpaceDbo>;

export type ISchedulusSpaceContext =
	ISpaceItemWithOptionalDbo<ICalendariumSpaceDbo>;
