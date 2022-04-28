import { WeekdayCode2 } from '@sneat/dto';

export interface IScheduleFilter {
	readonly text: string;
	readonly memberIDs?: string[];
	readonly weekdays?: WeekdayCode2[];
	readonly repeats?: string[];
}
