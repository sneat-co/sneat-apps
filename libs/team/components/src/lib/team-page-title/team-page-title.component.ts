import { Component, Input } from '@angular/core';
import { ITeamContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-team-page-title',
	templateUrl: './team-page-title.component.html',
})
export class TeamPageTitleComponent {
	@Input() icon?: string;
	@Input() generalTitle?: string;
	@Input({ required: true }) team?: ITeamContext;
	@Input() titlesByTeamType?: { [type: string]: string };

	public get typeTitle(): string {
		return this.team?.type && this.titlesByTeamType
			? this.titlesByTeamType[this.team.type]
			: '';
	}
}
