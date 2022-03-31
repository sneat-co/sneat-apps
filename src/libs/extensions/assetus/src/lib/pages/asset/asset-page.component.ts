//tslint:disable:no-unsafe-any
import {Component} from '@angular/core';
import {AssetBasePage} from '../../asset-base.page';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {AssetCategoryId, LiabilityServiceType} from 'sneat-shared/models/types';
import {IAssetGroupService, IAssetService} from 'sneat-shared/services/interfaces';
import {CommuneTopPage} from '../../../../pages/constants';

interface AssetService {
	type: string;
	title: string;
}

@Component({
	selector: 'app-asset',
	templateUrl: './asset-page.component.html',
	providers: [CommuneBasePageParams],
})
export class AssetPageComponent extends AssetBasePage {

	public segment: 'contacts' | 'taxes' | 'services' = 'services';
	public period = 'this-month';
	public scope: 'month' | 'year' = 'month';
	public assetCategoryId: AssetCategoryId;

	public assetServices: AssetService[] = [
		{type: 'electricity', title: 'Electricity'},
		{type: 'gas', title: 'Gas'},
		{type: 'waste_removal', title: 'Waste removal'},
		{type: 'internet', title: 'Internet'},
		{type: 'tv', title: 'TV'},
		{type: 'phone', title: 'Phone'},
	];

	mode: 'view' | 'edit' = 'view';

	constructor(
		params: CommuneBasePageParams,
		assetGroupsService: IAssetGroupService,
		assetService: IAssetService,
	) {
		super(CommuneTopPage.assets, params, assetService);
		const path = location.pathname;
		if (path.indexOf('vehicle') >= 0) {
			this.assetCategoryId = 'vehicles';
		} else if (path.indexOf('property') >= 0) {
			this.assetCategoryId = 'real_estate';
		}
	}

	public segmentChanged(ev: CustomEvent): void {
		console.log('Segment changed', ev);
		this.segment = ev.detail.value;
	}

	public periodChanged(ev: CustomEvent): void {
		this.period = ev.detail.value;
	}

	// tslint:disable-next-line:prefer-function-over-method
	public addContact(): void {
	}

	addService(type: LiabilityServiceType): void {
		console.log('AssetPage.addService:', type);
		if (!this.asset) {
			throw new Error('!this.asset');
		}
		this.navigateForward('select-provider', {
			asset: this.asset.dto.id,
			type,
		},                   undefined, {excludeCommuneId: true});
	}

	public scopeChanged(ev: CustomEvent): void {
		this.scope = ev.detail.value;
	}
}
