import { Component, Inject, Input } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { IAssetContext, AssetCategory } from '@sneat/mod-assetus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-asset-list-item',
	template: ``,
})
export class AssetListItemComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input() assetType?: AssetCategory;
	@Input() asset?: IAssetContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navCtrl: NavController, // private readonly assertService: AssertSer
	) {}
}
