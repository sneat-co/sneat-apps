import { Pipe, PipeTransform } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';

@Pipe({
	name: 'selectedMembers',
	standalone: false,
})
export class SelectedMembersPipe implements PipeTransform {
	transform(
		selectedIDs: readonly string[],
		memberBriefs?: Record<string, IContactBrief>,
	): IIdAndBrief<IContactBrief>[] {
		return selectedIDs.map((id) => {
			const brief = memberBriefs ? memberBriefs[id] : undefined;
			return { id, brief };
		}) as IIdAndBrief<IContactBrief>[];
	}
}
