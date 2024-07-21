import {
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { AssetCategory, IAssetBrief } from '@sneat/mod-assetus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceNavService } from '@sneat/team-services';
import { AssetService } from '../services';
import { MileAgeDialogComponent } from '../mileage-dialog/mileage-dialog.component';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'sneat-assets-list',
	templateUrl: './assets-list.component.html',
})
export class AssetsListComponent implements OnChanges {
	protected assets?: IIdAndBrief<IAssetBrief>[];
	protected mileAgeAsset?: IIdAndBrief<IAssetBrief>;

	@Input() allAssets?: IIdAndBrief<IAssetBrief>[];
	@Input({ required: true }) space?: ISpaceContext;
	@Input() assetType?: AssetCategory;
	@Input() filter = '';

	@Input() sorter: (
		a: IIdAndBrief<IAssetBrief>,
		b: IIdAndBrief<IAssetBrief>,
	) => number = () => {
		// if (a.brief && b.brief && a.brief.title > b.brief?.title) return 1;
		// if (a.brief && b.brief && a.brief.title < b.brief?.title) return -1;
		return 0;
	};

	protected deletingIDs: string[] = [];

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly assetService: AssetService,
		private readonly spaceNavService: SpaceNavService,
		private readonly modalCtrl: ModalController,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		const { allAssets, assetType, filter } = this;
		if (!allAssets) {
			this.assets = undefined;
			return;
		}
		if (!allAssets.length) {
			this.assets = [];
			return;
		}
		const f = filter?.toLowerCase();
		if (!allAssets || (!filter && !assetType)) {
			this.assets = [...allAssets];
		} else {
			this.assets = allAssets?.filter(
				(asset) =>
					(!assetType || asset?.brief?.category === assetType) &&
					(!filter || asset?.brief?.title?.toLowerCase().includes(f) || -1),
			);
		}
		this.assets = this.assets?.sort(this.sorter);
		console.log(
			'AssetsListComponent.ngOnChanges =>',
			changes,
			this.assetType,
			this.space,
			'allAssets:',
			this.allAssets,
			'filtered assets:',
			this.assets,
		);
	}

	protected goAsset(asset: IIdAndBrief<IAssetBrief>): void {
		if (!asset) {
			return;
		}
		// let path: string;
		// switch (asset?.brief?.type) {
		// 	// case 'vehicle':
		// 	// 	path = 'vehicle';
		// 	// 	break;
		// 	// case 'real_estate':
		// 	// 	path = this.team?.type === 'realtor' ? 'real-estate' : 'property';
		// 	// 	break;
		// 	default:
		// 		path = 'asset';
		// 		break;
		// }
		if (!this.space) {
			this.errorLogger.logError(
				'can not navigate to asset page without team context',
			);
			return;
		}
		this.spaceNavService
			.navigateForwardToSpacePage(this.space, `asset/${asset.id}`, {
				state: { asset },
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to navigate to asset page'),
			);
	}

	protected delete(event: Event, asset: IIdAndBrief<IAssetBrief>): void {
		event.stopPropagation();
		event.preventDefault();
		const { id, brief } = asset;
		this.deletingIDs.push(id);
		const deleteCompleted = () =>
			(this.deletingIDs = this.deletingIDs.filter((v) => v !== id));
		setTimeout(() => {
			if (
				!confirm(
					`Are you sure you want to delete this asset?

       ID: ${id}
       Title: ${brief?.title}

       This operation can not be undone.`,
				)
			) {
				deleteCompleted();
				return;
			}
			this.assetService.deleteAsset(this.space?.id || '', asset.id).subscribe({
				next: () => {
					this.assets = this.assets?.filter((a) => a.id !== id);
				},
				error: this.errorLogger.logErrorHandler(
					'failed to delete an asset with ID=' + id,
				),
				complete: deleteCompleted,
			});
		}, 1);
	}

	protected async addNewMilesAndFuel(
		event: Event,
		asset: IIdAndBrief<IAssetBrief>,
	) {
		event.stopPropagation();
		event.preventDefault();

		const modal = await this.modalCtrl.create({
			component: MileAgeDialogComponent,
			componentProps: { asset },
		});
		await modal.present();

		// this.mileAgeAsset = asset;

		// this.assetService.addNewMilesAndFuel(asset.id).subscribe({
		// 	next: () => {
		// 		this.goAsset(asset);
		// 	},
		// 	error: this.errorLogger.logErrorHandler(
		// 		'failed to add new miles and fuel to asset with ID=' + asset.id,
		// 	),
		// });
	}
}
