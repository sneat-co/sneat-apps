import { IAssetContext } from '@sneat/dto';
import { TeamBasePage, TeamComponentBaseParams } from '@sneat/team/components';

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
		throw new Error('not implemented yet');
		// this.navigateForward(path);
	}

	override onTeamDtoChanged(): void {
		this.assets = this.team?.dto?.assets?.map(brief => ({ id: brief.id, brief }));
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
