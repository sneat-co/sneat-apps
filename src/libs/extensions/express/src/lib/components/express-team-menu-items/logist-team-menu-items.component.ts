import { Component, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { teamPageUrl } from '@sneat/team/components';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-logist-team-menu-items',
	templateUrl: './logist-team-menu-items.component.html',
})
export class LogistTeamMenuItemsComponent {
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
