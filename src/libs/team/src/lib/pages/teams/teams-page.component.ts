import {Component} from '@angular/core';

@Component({
	selector: 'sneat-teams-page',
	templateUrl: 'teams-page.component.html',
})
export class TeamsPageComponent {
	constructor(
		// private readonly appContext: AppContextService,
	) {
	}

	ionViewDidEnter(): void {
		// this.appContext.setCurrent(AppCode.DataTug);
	}
}
