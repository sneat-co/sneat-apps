import { Component, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeamBaseComponent, teamPageUrl } from '@sneat/team/components';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-express-team-menu-items',
	templateUrl: './express-team-menu-items.component.html',
})
export class ExpressTeamMenuItemsComponent {
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	@Input() public team?: ITeamContext;

	contactGroups: { type: string, title: string, icon: string }[] = [
		{ type: 'agent', title: 'Agents', icon: 'body-outline' },
		{ type: 'buyer', title: 'Buyers', icon: 'cash-outline' },
		{ type: 'carrier', title: 'Carriers', icon: 'train-outline' },
		{ type: 'dispatcher', title: 'Dispatchers', icon: 'exit-outline' },
		{ type: 'shipper', title: 'Shippers', icon: 'boat-outline' },
	];

	readonly teamPageUrl = (page: string) => teamPageUrl(this.team, page);
}
