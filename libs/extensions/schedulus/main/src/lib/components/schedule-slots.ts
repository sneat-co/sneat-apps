import { IRelatedItemsByTeam } from '@sneat/dto';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { IScheduleFilter } from './schedule/components';

export function hasContact(
	teamID: string,
	contactIDs: readonly string[],
	related?: IRelatedItemsByTeam,
): boolean {
	if (!contactIDs.length) {
		return true;
	}
	const teamRelated = related && related[teamID];
	const contactusRelated = teamRelated && teamRelated['contactus'];
	const relatedContacts = contactusRelated && contactusRelated['contacts'];
	const relatedContactIDs = Object.keys(relatedContacts || {});
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
	slot: ISlotItem,
	filter: IScheduleFilter,
): boolean {
	const related =
		slot.happening?.dto?.related || slot.happening?.brief?.related;
	if (related && !hasContact(teamID, filter.contactIDs, related)) {
		return false;
	}
	// if (!hasWeekday(happening?.brief?.slots || happening?.dto?.slots, weekdays)) {
	// 	return false;
	// }
	const happeningBrief = slot.happening?.brief || slot.happening?.dto;
	if (
		filter.repeats?.length &&
		!happeningBrief?.slots?.some((slot) =>
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
