import { IIdAndDbo } from '@sneat/core';
import { IWithRelatedOnly } from '@sneat/dto';
import { ISpaceItemWithOptionalDbo } from '@sneat/space-models';
import { IHappeningBrief } from './happening';

export interface ICalendarHappeningBrief
	extends IHappeningBrief,
		IWithRelatedOnly {}

export interface ICalendariumSpaceDbo {
	readonly recurringHappenings?: Readonly<
		Record<string, ICalendarHappeningBrief>
	>;
}

export type ICalendariumSpaceDboWithID = IIdAndDbo<ICalendariumSpaceDbo>;

export type ICalendariumSpaceContext =
	ISpaceItemWithOptionalDbo<ICalendariumSpaceDbo>;
