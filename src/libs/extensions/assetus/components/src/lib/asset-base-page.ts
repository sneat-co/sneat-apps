import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent } from '@sneat/team/components';
import { IAssetContext } from '@sneat/team/models';
import { AssetComponentBaseParams } from './asset-component-base-params';

export abstract class AssetBasePage extends TeamBaseComponent {
	private assetContext?: IAssetContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		public readonly params: AssetComponentBaseParams,
	) {
		super(className, route, params.teamParams);
		this.route?.paramMap.subscribe({
			next: params => {
				console.log('AssetBasePage => route => params:', params);
				const id = params.get('id');
				if (!id) {
					this.assetContext = undefined;
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
