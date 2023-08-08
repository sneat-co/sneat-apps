import { ActivatedRoute } from '@angular/router';
import { AssetCategory, IAssetusTeamContext } from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IAssetContext } from '@sneat/team/models';

export abstract class AssetsBasePage extends TeamBaseComponent {

	public assets?: IAssetContext[];

	protected assetusTeam?: IAssetusTeamContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		protected readonly assetService: AssetService,
	) {
		super(className, route, params);
	}

	public goNew(assetType?: AssetCategory): void {
		const team = this.team;
		if (!team) {
			this.errorLogger.logError('no team context');
			return;
		}
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(team, 'new-asset', { state: { assetType } })
			.catch(this.errorLogger.logErrorHandler('Failed to navigate to new asset page'));
	}

	override onTeamDtoChanged(): void {
		const team = this.team;
		if (!team) {
			this.assets = undefined;
			return;
		}
		if (!this.assets && this.assetusTeam?.dto) {
			throw new Error('not implemented');
			// this.assets = this.assetusTeam?.dto?.assets;
		}
	}


	// protected onCommuneIdsChanged(communeIds: ICommuneIds): void {
	// 	super.onCommuneIdsChanged(communeIds);
	// 	if (this.communeRealId) {
	// 		this.subscriptions.push(
	// 			this.assetService.watchByCommuneId(this.communeRealId)
	// 				.subscribe(assets => {
	// 						console.log('Loaded assets:', assets);
	// 						this.setAssets(assets);
	// 					},
	// 				),
	// 		);
	// 	}
	// }

	// protected setAssets(assets: IAssetDto[]): void {
	// 	this.assets = assets;
	// }
}
