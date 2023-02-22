import {Component} from '@angular/core';
import {AssetsBasePage} from '../../assets-base.page';
import {IAssetDto} from 'sneat-shared/models/dto/dto-asset';
import {IAssetService} from 'sneat-shared/services/interfaces';
import {CommuneBasePageParams} from 'sneat-shared/services/params';

@Component({
	selector: 'sneat-real-estates',
	templateUrl: './real-estates-page.component.html',
	providers: [CommuneBasePageParams],
})
export class RealEstatesPageComponent extends AssetsBasePage {

	filter: string;

	constructor(
		params: CommuneBasePageParams,
		assetService: IAssetService,
	) {
		super(params, assetService);
	}

	protected setAssets(assets: IAssetDto[]): void {
		this.assets = assets.filter(a => a.categoryId === 'real_estate');
	}

	clearFilter(): void {
		this.filter = '';
	}

	filterChanged(event: Event): void {
		console.log(this.filter, event);
	}
}
