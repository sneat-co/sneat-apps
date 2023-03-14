import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAssetType } from '@sneat/dto';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Component({
	selector: 'sneat-new-asset-page',
	templateUrl: './new-asset-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewAssetPageComponent extends TeamBaseComponent {

	name?: string;

	public category?: IAssetType;

	public categories: IAssetType[] = [
		{ id: 'vehicle', title: 'Vehicle', order: 1 },
		{ id: 'real_estate', title: 'Real estate', order: 2 },
	];

	constructor(
		// assetCategoryService: IAssetCategoryService,
		// assetService: IAssetService,
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
	) {
		super('AssetNewPageComponent', route, params);
		const assetType = window.history.state['assetType'];
		if (assetType) {
			this.category = this.categories.find(c => c.id === assetType);
		}
		// this.categories = assetCategoryService.allAssetCategories();
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	public selectCategory(category: IAssetType): void {
		this.category = category;
	}
}
