import { Pipe, PipeTransform } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';

@Pipe({ name: 'selectedMembers' })
export class SelectedMembersPipe implements PipeTransform {
	transform(
		selectedIDs: string[],
		memberBriefs?: { [id: string]: IContactBrief },
	): IIdAndBrief<IContactBrief>[] {
		return selectedIDs.map((id) => {
			const brief = memberBriefs ? memberBriefs[id] : undefined;
			return { id, brief };
		}) as IIdAndBrief<IContactBrief>[];
	}
}
