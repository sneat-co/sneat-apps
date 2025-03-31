import { Pipe, PipeTransform } from '@angular/core';
import { IContactBrief, IContactWithSpace } from '@sneat/contactus-core';

@Pipe({ name: 'selectedContacts' })
export class SelectedContactsPipe implements PipeTransform {
	transform(
		selectedIDs: readonly string[],
		contactBriefs?: Record<string, IContactBrief>,
	): IContactWithSpace[] {
		return selectedIDs.map((id) => {
			const brief = contactBriefs ? contactBriefs[id] : undefined;
			return { id, brief };
		}) as IContactWithSpace[];
	}
}
