import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonSegment,
	IonSegmentButton,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { LiabilityServiceType } from '@sneat/mod-assetus-core';
import {
	AssetBasePage,
	AssetComponentBaseParams,
	AssetusServicesModule,
	VehicleCardComponent,
} from '@sneat/ext-assetus-components';
import { SpaceComponentBaseParams } from '@sneat/space-components';

interface LiabilityServiceBrief {
	type: LiabilityServiceType;
	title: string;
}

@Component({
	selector: 'sneat-asset-page',
	templateUrl: './asset-page.component.html',
	providers: [SpaceComponentBaseParams, AssetComponentBaseParams],
	imports: [
		FormsModule,
		VehicleCardComponent,
		ContactusServicesModule,
		AssetusServicesModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
		IonCard,
		IonItem,
		IonLabel,
		IonItemDivider,
		IonSegment,
		IonSegmentButton,
		IonIcon,
		IonCardContent,
		IonButton,
		IonSelectOption,
		IonSelect,
		IonItemGroup,
	],
})
export class AssetPageComponent extends AssetBasePage {
	public segment: 'contacts' | 'taxes' | 'services' = 'services';
	public period = 'this-month';
	public scope: 'month' | 'year' = 'year';

	public assetServices: LiabilityServiceBrief[] = [
		{ type: 'electricity', title: 'Electricity' },
		{ type: 'gas', title: 'Gas' },
		{ type: 'waste_removal', title: 'Waste removal' },
		{ type: 'internet', title: 'Internet' },
		{ type: 'tv', title: 'TV' },
		{ type: 'tv_license', title: 'TV' },
		{ type: 'phone', title: 'Phone' },
	];

	mode: 'view' | 'edit' = 'view';

	constructor() {
		const params = inject(AssetComponentBaseParams);

		super('AssetPageComponent', params);
		// const path = location.pathname;
		// if (path.includes('vehicle')) {
		// 	this.assetTypeId = 'vehicles';
		// } else if (path.includes('property')) {
		// 	this.assetTypeId = 'real_estate';
		// }
	}

	public segmentChanged(ev: CustomEvent): void {
		console.log('Segment changed', ev);
		this.segment = ev.detail.value;
	}

	public periodChanged(ev: CustomEvent): void {
		this.period = ev.detail.value;
	}

	public addContact(): void {
		//
	}

	addService(type: LiabilityServiceType): void {
		console.log('AssetPage.addService:', type);
		if (!this.asset) {
			throw new Error('!this.asset');
		}
		this.errorLogger.logError('Not implemented yet');
		// this.navigateForward('select-provider', {
		// 	asset: this.asset?.dto.id,
		// 	type,
		// }, undefined, { excludeCommuneId: true });
	}

	public scopeChanged(event: Event): void {
		this.scope = (event as CustomEvent).detail.value;
	}
}
