import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { IScheduleFilter } from './schedule/components/schedule-filter';

export function hasContact(
	item: { contactIDs?: string[] } | undefined,
	contactIDs?: string[],
): boolean {
	return (
		!contactIDs?.length ||
		!!item?.contactIDs?.some((id) => contactIDs.includes(id))
	);
}

// noinspection JSMethodCanBeStatic

// export function hasWeekday(slots: IHappeningSlot[] | undefined, weekdays?: WeekdayCode2[]): boolean {
// 	return !weekdays || !!slots?.some(slot => slot.weekdays?.some(wd => weekdays.includes(wd)));
// }

export function isSlotVisible(
	slot: ISlotItem,
	filter: IScheduleFilter,
): boolean {
	const { happening } = slot;
	const { contactIDs, repeats } = filter;
	if (happening?.brief && !hasContact(happening?.brief, contactIDs)) {
		return false;
	}
	// if (!hasWeekday(happening?.brief?.slots || happening?.dto?.slots, weekdays)) {
	// 	return false;
	// }
	if (
		repeats?.length &&
		!happening?.brief?.slots?.some((slot) => repeats.includes(slot.repeats))
	) {
		return false;
	}

	return (
		((!!slot.happening && filter.showRecurrings) ||
			(!!slot.happening && filter.showSingles)) &&
		(!filter || slot.title.toLowerCase().indexOf(filter.text) >= 0)
	);
}
