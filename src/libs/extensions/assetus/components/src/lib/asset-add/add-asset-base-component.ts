import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ITeamContext } from '@sneat/team/models';
import { AssetService } from '../asset-service';
import { ICreateAssetRequest } from '../asset-service.dto';

export abstract class AddAssetBaseComponent {
	public team?: ITeamContext;

	public country = 'ie';

	public isSubmitting = false;

	public titleForm = new UntypedFormGroup({
		title: new FormControl<string>('', Validators.required),
	});

	protected constructor(
		protected readonly teamParams: TeamComponentBaseParams,
		protected readonly assetService: AssetService,
	) {
	}

	protected createAssetAndGoToAssetPage(request: ICreateAssetRequest, team: ITeamContext): void {
		if (!this.team) {
			throw new Error('no team context');
		}
		this.assetService.createAsset(this.team, request)
			.subscribe({
				next: asset => {
					if (!asset.brief && asset.dto) {
						asset = { ...asset, brief: { ...asset.dto, category: asset.dto.category, id: asset.id } };
					}
					this.teamParams.teamNavService.navigateForwardToTeamPage(team, 'asset/' + asset.id,
						{ replaceUrl: true, state: { asset, team } })
						.catch(this.teamParams.errorLogger.logErrorHandler(`failed to navigate to team page`));
				},
				error: err => {
					this.isSubmitting = false;
					this.teamParams.errorLogger.logError(err, 'Failed to create a new asset');
				},
			});
	}
}
