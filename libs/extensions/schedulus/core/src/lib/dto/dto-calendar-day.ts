import { IByUser } from '@sneat/dto';
import { IHappeningSlot } from './happening';

export interface ICancellation {
  readonly at: string;
  readonly by: IByUser;
}

export interface ISlotAdjustment {
  readonly canceled?: ICancellation;
  readonly adjustment?: IHappeningSlot;
}

export interface IHappeningAdjustment {
  readonly slots: Readonly<Record<string, ISlotAdjustment>>;
}

export interface ICalendarDayBrief {
  readonly spaceID: string;
  readonly date: string;
  readonly happeningIDs?: string[];
  readonly happeningAdjustments: Readonly<Record<string, IHappeningAdjustment>>;
}

export type ICalendarDayDbo = ICalendarDayBrief;
