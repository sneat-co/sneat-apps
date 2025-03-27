import { Pipe, PipeTransform } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';

@Pipe({ name: 'selectedContacts' })
export class SelectedContactsPipe implements PipeTransform {
	transform(
		selectedIDs: readonly string[],
		contactBriefs?: Record<string, IContactBrief>,
	): IIdAndBrief<IContactBrief>[] {
		return selectedIDs.map((id) => {
			const brief = contactBriefs ? contactBriefs[id] : undefined;
			return { id, brief };
		}) as IIdAndBrief<IContactBrief>[];
	}
}
