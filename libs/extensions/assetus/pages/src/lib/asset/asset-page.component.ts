import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LiabilityServiceType } from '@sneat/dto';
import {
	AssetBasePage,
	AssetComponentBaseParams,
	ModuleAssetRealEstate,
	VehicleCardComponent,
} from '@sneat/extensions/assetus/components';

interface LiabilityServiceBrief {
	type: LiabilityServiceType;
	title: string;
}

@Component({
	selector: 'sneat-asset-page',
	templateUrl: './asset-page.component.html',
	providers: [AssetComponentBaseParams],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ModuleAssetRealEstate,
		VehicleCardComponent,
		IonicModule,
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

	constructor(route: ActivatedRoute, params: AssetComponentBaseParams) {
		super('AssetPageComponent', route, params);
		// const path = location.pathname;
		// if (path.indexOf('vehicle') >= 0) {
		// 	this.assetTypeId = 'vehicles';
		// } else if (path.indexOf('property') >= 0) {
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
