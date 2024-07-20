import { ActivatedRoute } from '@angular/router';
import { IIdAndBrief } from '@sneat/core';
import {
	AssetCategory,
	IAssetBrief,
	IAssetusSpaceContext,
} from '@sneat/mod-assetus-core';
import { AssetService } from '@sneat/extensions/assetus/components';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';

export abstract class AssetsBasePage extends SpaceBaseComponent {
	protected assets?: IIdAndBrief<IAssetBrief>[];

	protected assetusTeam?: IAssetusSpaceContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		protected readonly assetService: AssetService,
	) {
		super(className, route, params);
	}

	public goNew(assetType?: AssetCategory): void {
		const space = this.team;
		if (!space) {
			this.errorLogger.logError('no team context');
			return;
		}
		this.teamParams.teamNavService
			.navigateForwardToSpacePage(space, 'new-asset', { state: { assetType } })
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to navigate to new asset page',
				),
			);
	}

	override onSpaceDboChanged(): void {
		super.onSpaceDboChanged();
		const space = this.team;
		if (!space) {
			this.assets = undefined;
			return;
		}
		if (!this.assets && this.assetusTeam?.dbo) {
			throw new Error('not implemented');
			// this.assets = this.assetusTeam?.dto?.assets;
		}
	}

	// protected setAssets(assets: IAssetDto[]): void {
	// 	this.assets = assets;
	// }
}
