import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AssetType } from '@sneat/dto';
import { IAssetContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-assets-list',
	template: `
		<ion-item *ngIf="assets && !assets?.length" disabled>No items created yet</ion-item>
		<ion-item *ngIf="!assets" disabled>
			<ion-spinner slot="start" name="lines-small"></ion-spinner>
			<ion-label>Loading...</ion-label>
		</ion-item>
		<ng-container *ngIf="assets?.length">
			<sneat-asset-list-item
				*ngFor="let asset of assets; trackBy: id"
				[asset]="asset"
				[team]="team"
				[assetType]="assetType"
			></sneat-asset-list-item>
		</ng-container>
	`,
})
export class AssetsListComponent implements OnChanges {

	assets?: IAssetContext[];

	@Input() allAssets?: IAssetContext[];
	@Input() team?: ITeamContext;
	@Input() assetType?: AssetType;
	@Input() filter = '';

	public id = (_: number, asset: IAssetContext) => asset.id;

	ngOnChanges(changes: SimpleChanges): void {
		const { allAssets, assetType, filter } = this;
		if (!allAssets) {
			this.assets = undefined;
			return;
		}
		if (!allAssets.length) {
			this.assets = [];
			return;
			;
		}
		const f = filter?.toLowerCase();
		if (!allAssets || !filter && !assetType) {
			this.assets = [...allAssets];
		} else {
			this.assets = allAssets
				?.filter(asset => (!assetType || asset?.brief?.type === assetType) &&
					(!filter || (asset?.brief?.title?.toLowerCase().indexOf(f) || -1) >= 0));
		}
		this.assets = this.assets?.sort((a, b) => {
			if (a.brief && b.brief && a.brief.title > b.brief?.title) return 1;
			if (a.brief && b.brief && a.brief.title < b.brief?.title) return -1;
			return 0;
		});
		console.log('AssetsListComponent.ngOnChanges =>', this.assetType, this.team, 'allAssets:', this.allAssets, 'filtered assets:', this.assets);
	}
}
