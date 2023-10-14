import { Pipe, PipeTransform } from '@angular/core';
import { IContactBrief } from '@sneat/dto';
import { IContactContext, ITeamRef } from '@sneat/team/models';

@Pipe({ name: 'selectedMembers' })
export class SelectedMembersPipe implements PipeTransform {
	transform(
		selectedIDs: string[],
		team: ITeamRef,
		memberBriefs?: { [id: string]: IContactBrief },
	): IContactContext[] {
		return selectedIDs.map((id) => {
			const brief = memberBriefs ? memberBriefs[id] : undefined;
			return { id, brief, team };
		});
	}
}
