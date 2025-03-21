import { IIdAndBrief } from '@sneat/core';
import {
	AssetCategory,
	IAssetBrief,
	IAssetusSpaceContext,
} from '@sneat/mod-assetus-core';
import { AssetService } from '@sneat/extensions-assetus-components';
import { SpaceBaseComponent } from '@sneat/team-components';

export abstract class AssetsBasePage extends SpaceBaseComponent {
	protected assets?: IIdAndBrief<IAssetBrief>[];

	protected assetusSpace?: IAssetusSpaceContext;

	protected constructor(
		className: string,
		protected readonly assetService: AssetService,
	) {
		super(className);
	}

	public goNew(assetType?: AssetCategory): void {
		const space = this.space;
		if (!space) {
			this.errorLogger.logError('no team context');
			return;
		}
		this.spaceParams.spaceNavService
			.navigateForwardToSpacePage(space, 'new-asset', { state: { assetType } })
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to navigate to new asset page',
				),
			);
	}

	override onSpaceDboChanged(): void {
		super.onSpaceDboChanged();
		const space = this.space;
		if (!space) {
			this.assets = undefined;
			return;
		}
		if (!this.assets && this.assetusSpace?.dbo) {
			throw new Error('not implemented');
			// this.assets = this.assetusTeam?.dto?.assets;
		}
	}

	// protected setAssets(assets: IAssetDto[]): void {
	// 	this.assets = assets;
	// }
}
