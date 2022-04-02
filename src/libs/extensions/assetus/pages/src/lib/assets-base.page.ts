import { TeamBasePage, TeamComponentBaseParams } from '@sneat/team/components';
import { IAssetContext } from '@sneat/team/models';

export abstract class AssetsBasePage extends TeamBasePage {

	public assets?: IAssetContext[];

	protected constructor(
		className: string,
		params: TeamComponentBaseParams,
		// protected assetService: IAssetService,
	) {
		super(className, params);
	}

	public goNew(path: 'new-asset' | 'add-vehicle' | 'add-dwelling' = 'new-asset'): void {
		const team = this.team;
		if (!team) {
			this.errorLogger.logError('no team context');
			return;
		}
		this.teamParams.teamNavService.navigateForwardToTeamPage(team, path);
	}

	override onTeamDtoChanged(): void {
		const team = this.team;
		if (!team) {
			this.assets = undefined;
			return;
		}
		if (!this.assets) {
			this.assets = this.team?.dto?.assets?.map(brief => {
				const asset: IAssetContext = { id: brief.id, brief, team };
				return asset;
			});
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
