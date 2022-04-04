import { ActivatedRoute } from '@angular/router';
import { TeamItemBaseComponent } from '@sneat/team/components';
import { IAssetContext } from '@sneat/team/models';
import { AssetComponentBaseParams } from './asset-component-base-params';

export abstract class AssetBasePage extends TeamItemBaseComponent {
	private assetContext?: IAssetContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		public readonly params: AssetComponentBaseParams,
		parentPagePath = 'assets',
	) {
		super(className, route, params.teamParams, parentPagePath);
		this.assetContext = history.state.asset as IAssetContext | undefined;
		this.route?.paramMap.subscribe({
			next: params => {
				console.log('AssetBasePage => route => params:', params);
				const id = params.get('assetID');
				if (!id) {
					this.assetContext = undefined;
					return;
				}
				if (this.assetContext?.id === id) {
					return;
				}
				this.assetContext = { id: id };
				this.params.assetService.watchAssetByID(id).subscribe({
					next: asset => {
						this.assetContext = asset;
					},
					error: this.errorLogger.logErrorHandler('failed to set a watch on asset by ID=' + id),
				});
			},
		});

	}

	public get asset() {
		return this.assetContext;
	}
}
