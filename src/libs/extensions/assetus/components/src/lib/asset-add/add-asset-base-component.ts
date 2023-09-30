import { Component, Inject, InjectionToken } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IAssetDtoBase, IAssetMainData } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IContactusTeamDtoWithID, ITeamContext } from '@sneat/team/models';
import { SneatBaseComponent } from '@sneat/ui';
import { AssetService } from '../services/asset-service';
import { ICreateAssetRequest } from '../asset-service.dto';

@Component({ template: '' })
export abstract class AddAssetBaseComponent extends SneatBaseComponent {

	public team?: ITeamContext; // intentionally public as will be overridden as @Input() in child components
	public contactusTeam?: IContactusTeamDtoWithID;
	public country?: string;

	public isSubmitting = false;

	public titleForm = new UntypedFormGroup({
		title: new FormControl<string>('', Validators.required),
	});

	protected constructor(
		@Inject(new InjectionToken('className')) className: string,
		protected readonly route: ActivatedRoute,
		protected teamParams: TeamComponentBaseParams,
		protected readonly assetService: AssetService,
	) {
		super(className, teamParams.errorLogger);
	}

	protected createAssetAndGoToAssetPage<A extends IAssetMainData, D extends IAssetDtoBase>(request: ICreateAssetRequest<A>, team: ITeamContext): void {
		if (!this.team) {
			throw new Error('no team context');
		}
		this.assetService.createAsset<A, D>(this.team, request)
			.subscribe({
				next: asset => {
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
