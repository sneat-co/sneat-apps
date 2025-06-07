import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonBackButton,
	IonButtons,
	IonCard,
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonRadio,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { IAssetCategory } from '@sneat/mod-assetus-core';
import {
	AssetAddDocumentComponent,
	AssetAddDwellingComponent,
	AssetAddVehicleComponent,
	AssetusServicesModule,
} from '@sneat/ext-assetus-components';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
	SpacePageTitleComponent,
} from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';

@Component({
	imports: [
		FormsModule,
		SpacePageTitleComponent,
		ContactusServicesModule,
		AssetusServicesModule,
		AssetAddDocumentComponent,
		AssetAddVehicleComponent,
		AssetAddDwellingComponent,
		SpaceServiceModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonContent,
		IonCard,
		IonItem,
		IonLabel,
		IonList,
		IonRadio,
	],
	providers: [
		{ provide: ClassName, useValue: 'NewAssetPageComponent' },
		SpaceComponentBaseParams,
	],
	selector: 'sneat-new-asset-page',
	templateUrl: './new-asset-page.component.html',
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
		super();
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
