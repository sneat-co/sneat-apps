import { Component, Inject, OnDestroy } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { CONTACT_ROLES_BY_TYPE, IContactRole } from '@sneat/app';
import { NewCompanyFormComponent } from '@sneat/contactus-shared';
import { ISelectItem } from '@sneat/ui';
import { ContactRole } from '@sneat/contactus-core';
import { SpaceBaseComponent } from '@sneat/space-components';
import { IContactContext } from '@sneat/contactus-core';
import { first } from 'rxjs';

@Component({
	selector: 'sneat-new-logist-company-page',
	templateUrl: 'new-logist-company-page.component.html',
	imports: [
		NewCompanyFormComponent,
		IonContent,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
	],
})
export class NewLogistCompanyPageComponent
	extends SpaceBaseComponent
	implements OnDestroy
{
	readonly contactTypes: ISelectItem[] = [
		{ id: 'agent', title: 'Agent', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyer', iconName: 'cash-outline' },
		{ id: 'freight_agent', title: 'Freight Agent', iconName: 'train-outline' },
		{ id: 'dispatcher', title: 'Dispatcher', iconName: 'business-outline' },
		{ id: 'shipper', title: 'Shipper', iconName: 'boat-outline' },
	];

	protected contactRole?: ContactRole;

	constructor(
		@Inject(CONTACT_ROLES_BY_TYPE)
		public readonly contactRolesByType: Record<string, IContactRole[]>,
	) {
		super('NewLogistCompanyPageComponent');
		this.contactTypes = contactRolesByType['company'];
		this.route.queryParamMap
			.pipe(first(), this.takeUntilDestroyed())
			.subscribe({
				next: (value) => {
					this.contactRole = (value.get('role') as ContactRole) || undefined;
				},
			});
	}

	onContactCreated(contact: IContactContext): void {
		console.log('NewLogistCompanyPageComponent.onContactCreated()', contact);
		this.navController.pop().catch(() => {
			this.navController
				.navigateBack(['contacts'], { relativeTo: this.route })
				.catch(
					this.errorLogger.logErrorHandler(
						'failed to navigate back to contacts page',
					),
				);
		});
	}
}
