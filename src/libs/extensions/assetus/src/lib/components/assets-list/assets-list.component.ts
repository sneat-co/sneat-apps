import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IAssetDto} from 'sneat-shared/models/dto/dto-asset';
import {Commune} from 'sneat-shared/models/ui/ui-models';
import {RxRecordKey} from 'rxstore/schema';

@Component({
	selector: 'assets-list',
	template: `
		<ng-container *ngFor="let asset of _assets; trackBy: trackById">
			<asset-list-item [asset]="asset" [commune]="commune" [category]="category"></asset-list-item>
		</ng-container>
	`,
})
export class AssetsListComponent implements OnChanges {

	// tslint:disable-next-line:variable-name // TODO: remove
	_assets: IAssetDto[];

	@Input() assets: IAssetDto[];
	@Input() commune: Commune;
	@Input() category: string;
	@Input() filter: string;

	// noinspection JSMethodCanBeStatic
	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, asset: IAssetDto): RxRecordKey | undefined {
		return asset.id;
	}

	ngOnChanges(changes: SimpleChanges): void {
		// tslint:disable-next-line:no-this-assignment
		const {assets, category, filter} = this;
		this._assets = assets && (category || filter)
			? assets.filter(asset => (!category || asset.categoryId === category) && (!filter || asset.title && asset.title.indexOf(filter) >= 0))
			: assets;
	}
}
