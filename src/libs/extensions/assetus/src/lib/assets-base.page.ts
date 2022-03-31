import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {IAssetService, ICommuneIds} from 'sneat-shared/services/interfaces';
import {IAssetDto} from 'sneat-shared/models/dto/dto-asset';
import {CommuneTopPage} from '../../pages/constants';

export abstract class AssetsBasePage extends CommuneBasePage {

	protected constructor(
		params: CommuneBasePageParams,
		protected assetService: IAssetService,
	) {
		super(CommuneTopPage.home, params);
	}

	public assets: IAssetDto[];

	protected onCommuneIdsChanged(communeIds: ICommuneIds): void {
		super.onCommuneIdsChanged(communeIds);
		if (this.communeRealId) {
			this.subscriptions.push(
				this.assetService.watchByCommuneId(this.communeRealId)
					.subscribe(assets => {
							console.log('Loaded assets:', assets);
							this.setAssets(assets);
						},
					),
			);
		}
	}

	protected setAssets(assets: IAssetDto[]): void {
		this.assets = assets;
	}

	public goNew(path: 'new-asset' | 'add-vehicle' | 'add-dwelling' = 'new-asset'): void {
		this.navigateForward(path);
	}
}
