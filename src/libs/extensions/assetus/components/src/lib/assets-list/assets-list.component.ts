import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AssetType } from '@sneat/dto';
import { IAssetContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-assets-list',
	template: `
		<sneat-asset-list-item
			*ngFor="let asset of assets; trackBy: id"
			[asset]="asset"
			[team]="team"
			[assetType]="assetType"
		></sneat-asset-list-item>
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
		const f = filter?.toLowerCase();
		if (!allAssets || !filter && !assetType) {
			this.assets = allAssets;
		} else {
			this.assets = allAssets
				?.filter(asset => (!assetType || asset?.brief?.type === assetType) &&
					(!filter || (asset?.brief?.title?.toLowerCase().indexOf(f) || -1) >= 0));
		}
		console.log('AssetsListComponent.ngOnChanges =>', this.assetType, this.team, 'allAssets:', this.allAssets, 'filtered assets:', this.assets);
	}
}
