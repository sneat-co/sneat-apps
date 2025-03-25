import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { IAssetCategory } from '@sneat/mod-assetus-core';
import {
	AssetAddDocumentComponent,
	AssetAddDwellingComponent,
	AssetAddVehicleComponent,
	AssetusServicesModule,
} from '@sneat/extensions-assetus-components';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
	SpacePageTitleComponent,
} from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';

@Component({
	selector: 'sneat-new-asset-page',
	templateUrl: './new-asset-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SpacePageTitleComponent,
		ContactusServicesModule,
		AssetusServicesModule,
		AssetAddDocumentComponent,
		AssetAddVehicleComponent,
		AssetAddDwellingComponent,
		SpaceServiceModule,
	],
})
export class NewAssetPageComponent extends SpaceBaseComponent {
	protected name?: string;

	protected category?: IAssetCategory;

	public categories: IAssetCategory[] = [
		{ id: 'vehicle', title: 'Vehicle', order: 1 },
		{ id: 'dwelling', title: 'Real estate', order: 2 },
	];

	constructor() {
		// assetService: IAssetService, // assetCategoryService: IAssetCategoryService,
		super('AssetNewPageComponent');
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
