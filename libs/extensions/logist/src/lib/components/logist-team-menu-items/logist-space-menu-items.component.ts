import { Component, Input, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { spacePageUrl } from '@sneat/space-components';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-logist-space-menu-items',
	templateUrl: './logist-space-menu-items.component.html',
	imports: [IonItem, RouterLink, IonIcon, IonLabel, IonButtons, IonButton],
})
export class LogistSpaceMenuItemsComponent {
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	@Input({ required: true }) public space?: ISpaceContext;

	contactGroups: { type: string; title: string; icon: string }[] = [
		{ type: 'agent', title: 'Agents', icon: 'body-outline' },
		{ type: 'buyer', title: 'Buyers', icon: 'cash-outline' },
		{ type: 'freight_agent', title: 'Freight Agent', icon: 'train-outline' },
		{ type: 'dispatcher', title: 'Dispatchers', icon: 'exit-outline' },
		{ type: 'shipper', title: 'Shippers', icon: 'boat-outline' },
	];

	readonly spacePageUrl = (page: string) => spacePageUrl(this.space, page);
}
