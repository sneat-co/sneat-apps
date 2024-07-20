import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { IAssetCategory } from '@sneat/mod-assetus-core';
import {
	AddAssetComponentsModule,
	AssetusServicesModule,
} from '@sneat/extensions/assetus/components';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
	TeamCoreComponentsModule,
} from '@sneat/team-components';

@Component({
	selector: 'sneat-new-asset-page',
	templateUrl: './new-asset-page.component.html',
	providers: [SpaceComponentBaseParams],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		AddAssetComponentsModule,
		TeamCoreComponentsModule,
		ContactusServicesModule,
		AssetusServicesModule,
	],
})
export class NewAssetPageComponent extends SpaceBaseComponent {
	protected name?: string;

	protected category?: IAssetCategory;

	public categories: IAssetCategory[] = [
		{ id: 'vehicle', title: 'Vehicle', order: 1 },
		{ id: 'dwelling', title: 'Real estate', order: 2 },
	];

	constructor(
		// assetCategoryService: IAssetCategoryService,
		// assetService: IAssetService,
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
	) {
		super('AssetNewPageComponent', route, params);
		const assetType = window.history.state['assetType'];
		if (assetType) {
			this.category = this.categories.find((c) => c.id === assetType);
		}
		// this.categories = assetCategoryService.allAssetCategories();
	}

	public selectCategory(category: IAssetCategory): void {
		this.category = category;
	}
}
