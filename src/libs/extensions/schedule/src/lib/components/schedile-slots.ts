import {SlotItem} from '../view-models';

export function isSlotVisible(slot: SlotItem, filter: string, showRegulars: boolean, showEvents: boolean): boolean {
	return (!!slot.regular && showRegulars || !!slot.single && showEvents) &&
		(
			!filter ||
			slot.title.toLowerCase()
				.indexOf(filter) >= 0 ||
			!!slot.participants && slot.participants.some(participant => participant.title.toLowerCase()
				.indexOf(filter) >= 0)
		);

}
