import { Pipe, PipeTransform } from '@angular/core';
import { IMemberBrief } from '@sneat/dto';
import { IMemberContext } from '@sneat/team/models';

@Pipe({ name: 'selectedMembers' })
export class SelectedMembersPipe implements PipeTransform {
	transform(selectedIDs: string[], memberBriefs?: IMemberBrief[]): IMemberContext[] {
		return selectedIDs.map(id => {
			const brief = memberBriefs?.find(b => b.id === id);
			return {id, brief, team: {id: ''}} // TODO: pass team context
		});
	}
}
