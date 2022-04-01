import {Component} from '@angular/core';
import {IAssetCategoryService, IAssetService} from 'sneat-shared/services/interfaces';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {IAssetDtoCategory} from 'sneat-shared/models/dto/dto-asset';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {RxRecordKey} from 'rxstore/schema';

@Component({
	selector: 'app-asset-new',
	templateUrl: './asset-new-page.component.html',
	providers: [CommuneBasePageParams],
})
export class AssetNewPageComponent extends CommuneBasePage {

	name: string;

	public category: IAssetDtoCategory;

	public categories: IAssetDtoCategory[];

	constructor(
		assetCategoryService: IAssetCategoryService,
		assetService: IAssetService,
		params: CommuneBasePageParams,
	) {
		super('budget', params);
		this.categories = assetCategoryService.allAssetCategories();
	}

	public selectCategory(category: IAssetDtoCategory): void {
		this.category = category;
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, item: { id: string }): RxRecordKey | undefined {
		return item.id;
	}
}
