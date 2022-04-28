import {ISlotItem} from '../view-models';
import { IScheduleFilter } from './schedule-filter/schedule-filter';

export function isSlotVisible(slot: ISlotItem, filter: IScheduleFilter, showRegulars: boolean, showEvents: boolean): boolean {
	return (!!slot.happening && showRegulars || !!slot.happening && showEvents) &&
		(
			!filter ||
			slot.title.toLowerCase()
				.indexOf(filter.text) >= 0 ||
			!!slot.participants && slot.participants.some(participant => participant.title.toLowerCase()
				.indexOf(filter.text) >= 0)
		);

}
