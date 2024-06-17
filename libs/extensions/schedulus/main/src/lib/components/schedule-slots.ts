import { getRelatedItemIDs, IRelatedItemsByModule } from '@sneat/dto';
import { IHappeningSlotUiItem } from '@sneat/extensions/schedulus/shared';
import { ICalendarFilter } from './calendar/components/calendar-filter/calendar-filter';

export function hasContact(
	teamID: string,
	contactIDs: readonly string[],
	related?: IRelatedItemsByModule,
): boolean {
	if (!contactIDs.length) {
		return true;
	}
	const relatedContactIDs = getRelatedItemIDs(
		related,
		'contactus',
		'contacts',
		teamID,
	);
	console.log(
		'hasContact() related=',
		related,
		'relatedContactIDs:',
		relatedContactIDs,
	);
	return (
		(!relatedContactIDs.length && contactIDs.includes('')) ||
		relatedContactIDs.some((id) => contactIDs.includes(id))
	);
}

// noinspection JSMethodCanBeStatic

// export function hasWeekday(slots: IHappeningSlot[] | undefined, weekdays?: WeekdayCode2[]): boolean {
// 	return !weekdays || !!slots?.some(slot => slot.weekdays?.some(wd => weekdays.includes(wd)));
// }

export function isSlotVisible(
	teamID: string,
	slot: IHappeningSlotUiItem,
	filter: ICalendarFilter,
): boolean {
	if (
		!hasContact(
			teamID,
			filter.contactIDs,
			slot.happening?.dbo?.related || slot.happening?.brief?.related,
		)
	) {
		return false;
	}
	// if (!hasWeekday(happening?.brief?.slots || happening?.dto?.slots, weekdays)) {
	// 	return false;
	// }
	const happeningBrief = slot.happening?.brief || slot.happening?.dbo;
	if (
		filter.repeats?.length &&
		!Object.values(happeningBrief?.slots || {}).some((slot) =>
			filter.repeats.includes(slot.repeats),
		)
	) {
		return false;
	}

	return (
		((!!slot.happening && filter.showRecurrings) ||
			(!!slot.happening && filter.showSingles)) &&
		(!filter || slot.title.toLowerCase().includes(filter.text))
	);
}
