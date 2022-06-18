import { Component } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-express-main-page',
	templateUrl: './express-team-page.component.html',
	styleUrls: ['./express-team-page.component.scss'],
})
export class ExpressTeamPageComponent {
	public team?: ITeamContext = {
		id: 'fastline',
		brief: { id: 'fastline', type: 'company', title: 'FastLine' },
	};
}
