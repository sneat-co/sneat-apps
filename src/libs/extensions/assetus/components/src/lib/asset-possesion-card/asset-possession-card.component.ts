import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ISelectItem, SelectFromListModule } from '@sneat/components';
import { AssetPossession, AssetPossessions } from '@sneat/dto';
import { IAssetContext } from '@sneat/team/models';

@Component({
	standalone: true,
	selector: 'sneat-asset-possession-card',
	templateUrl: './asset-possession-card.component.html',
	imports: [
		IonicModule,
		FormsModule,
		SelectFromListModule,
		NgIf,
	],
})
export class AssetPossessionCardComponent {
	@Input() public asset?: IAssetContext;
	@Output() public assetChange = new EventEmitter<IAssetContext>();

	protected readonly possessionOptions: ISelectItem[] = AssetPossessions.map(p => ({ id: p, title: p, iconName: 'radio-button-off' }));

	protected onPossessionChanged(possession: string): void {
		if (this.asset?.dto) {
			this.asset = { ...this.asset, dto: { ...this.asset.dto, possession: possession as AssetPossession } };
			this.assetChange.emit(this.asset);
		}
	}
}
