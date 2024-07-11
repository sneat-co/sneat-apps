import { Component, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { spacePageUrl } from '@sneat/team-components';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-logist-team-menu-items',
	templateUrl: './logist-team-menu-items.component.html',
})
export class LogistTeamMenuItemsComponent {
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	@Input() public team?: ISpaceContext;

	contactGroups: { type: string; title: string; icon: string }[] = [
		{ type: 'agent', title: 'Agents', icon: 'body-outline' },
		{ type: 'buyer', title: 'Buyers', icon: 'cash-outline' },
		{ type: 'freight_agent', title: 'Freight Agent', icon: 'train-outline' },
		{ type: 'dispatcher', title: 'Dispatchers', icon: 'exit-outline' },
		{ type: 'shipper', title: 'Shippers', icon: 'boat-outline' },
	];

	readonly teamPageUrl = (page: string) => spacePageUrl(this.team, page);
}
