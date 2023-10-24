import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IAssetCategory } from '@sneat/dto';
import { AddAssetComponentsModule } from '@sneat/extensions/assetus/components';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
	TeamCoreComponentsModule,
} from '@sneat/team-components';

@Component({
	selector: 'sneat-new-asset-page',
	templateUrl: './new-asset-page.component.html',
	providers: [TeamComponentBaseParams],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		AddAssetComponentsModule,
		TeamCoreComponentsModule,
	],
})
export class NewAssetPageComponent extends TeamBaseComponent {
	name?: string;

	public category?: IAssetCategory;

	public categories: IAssetCategory[] = [
		{ id: 'vehicle', title: 'Vehicle', order: 1 },
		{ id: 'dwelling', title: 'Real estate', order: 2 },
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
			this.category = this.categories.find((c) => c.id === assetType);
		}
		// this.categories = assetCategoryService.allAssetCategories();
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	public selectCategory(category: IAssetCategory): void {
		this.category = category;
	}
}
