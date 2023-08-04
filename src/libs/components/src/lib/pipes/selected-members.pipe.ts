import { Pipe, PipeTransform } from '@angular/core';
import { IMemberBrief } from '@sneat/dto';
import { IMemberContext, ITeamContext, ITeamRef } from '@sneat/team/models';

@Pipe({ name: 'selectedMembers' })
export class SelectedMembersPipe implements PipeTransform {
	transform(selectedIDs: string[], team: ITeamRef, memberBriefs?: { [id: string]: IMemberBrief }): IMemberContext[] {
		return selectedIDs.map(id => {
			const brief = memberBriefs ? memberBriefs[id] : undefined;
			return { id, brief, team };
		});
	}
}
