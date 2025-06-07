import { Component, Input, inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { IAssetContext, AssetCategory } from '@sneat/mod-assetus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-asset-list-item',
	template: ``,
})
export class AssetListItemComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly navCtrl = inject(NavController);

	@Input({ required: true }) space?: ISpaceContext;
	@Input() assetType?: AssetCategory;
	@Input() asset?: IAssetContext;
}
