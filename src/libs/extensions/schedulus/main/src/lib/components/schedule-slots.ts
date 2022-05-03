import {ISlotItem} from '@sneat/extensions/schedulus/shared';
import { IScheduleFilter } from './schedule-filter/schedule-filter';

export function isSlotVisible(slot: ISlotItem, filter: IScheduleFilter): boolean {
	return (!!slot.happening && filter.showRecurrings || !!slot.happening && filter.showSingles) &&
		(
			!filter ||
			slot.title.toLowerCase()
				.indexOf(filter.text) >= 0 ||
			!!slot.participants && slot.participants.some(participant => participant.title.toLowerCase()
				.indexOf(filter.text) >= 0)
		);

}
