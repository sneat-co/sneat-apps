import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IAssetContext } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-assets-list',
	template: `
		<ng-container *ngFor="let asset of _assets; trackBy: id">
			<sneat-asset-list-item [asset]="asset" [team]="team" [category]="category"></sneat-asset-list-item>
		</ng-container>
	`,
})
export class AssetsListComponent implements OnChanges {

	// tslint:disable-next-line:variable-name // TODO: remove
	_assets?: IAssetContext[];

	@Input() assets?: IAssetContext[];
	@Input() team?: ITeamContext;
	@Input() category?: string;
	@Input() filter = '';

	public id = (_: number, asset: IAssetContext) => asset.id;

	ngOnChanges(changes: SimpleChanges): void {
		// tslint:disable-next-line:no-this-assignment
		const { assets, category, filter } = this;
		this._assets = assets && (category || filter)
			? assets.filter(asset => (!category || asset?.dto?.type === category) && (!filter || (asset?.brief?.title.indexOf(filter) || -1) >= 0))
			: assets;
	}
}
