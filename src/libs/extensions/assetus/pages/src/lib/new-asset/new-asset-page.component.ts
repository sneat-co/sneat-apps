import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IAssetDtoCategory } from '@sneat/dto';
import { TeamBasePage, TeamComponentBaseParams, TeamContextComponent } from '@sneat/team/components';

@Component({
	selector: 'sneat-new-asset-page',
	templateUrl: './new-asset-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewAssetPageComponent extends TeamBasePage implements AfterViewInit {

	@ViewChild('teamPageContext')
	public teamPageContext?: TeamContextComponent;

	name?: string;

	public category?: IAssetDtoCategory;

	public categories: IAssetDtoCategory[] = [
		{ id: 'vehicle', title: 'Vehicle', order: 1 },
		{ id: 'real_estate', title: 'Real estate', order: 2 },
	];

	constructor(
		// assetCategoryService: IAssetCategoryService,
		// assetService: IAssetService,
		params: TeamComponentBaseParams,
	) {
		super('AssetNewPageComponent', params);
		const assetType = window.history.state['assetType'];
		if (assetType) {
			this.category = this.categories.find(c => c.id === assetType);
		}
		// this.categories = assetCategoryService.allAssetCategories();
	}

	readonly id = (i: number, item: { id: string }) => item.id;

	ngAfterViewInit(): void {
		console.log('ngAfterViewInit', this.teamPageContext);
		this.setTeamPageContext(this.teamPageContext);
	}

	public selectCategory(category: IAssetDtoCategory): void {
		this.category = category;
	}
}
