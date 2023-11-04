import { Component, Inject, InjectionToken, Input } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IContactusTeamDtoAndID } from '@sneat/contactus-core';
import { IAssetDtoBase, IAssetMainData } from '@sneat/mod-assetus-core';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { ITeamContext } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { AssetService } from '../services';
import { ICreateAssetRequest } from '../services';

@Component({ template: '' })
export abstract class AddAssetBaseComponent extends SneatBaseComponent {
	@Input({ required: true }) team?: ITeamContext;

	public static readonly metadata = {
		inputs: ['team'],
	};

	public contactusTeam?: IContactusTeamDtoAndID;
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

	protected createAssetAndGoToAssetPage<
		A extends IAssetMainData,
		D extends IAssetDtoBase,
	>(request: ICreateAssetRequest<A>, team: ITeamContext): void {
		if (!this.team) {
			throw new Error('no team context');
		}
		this.assetService.createAsset<A, D>(this.team, request).subscribe({
			next: (asset) => {
				this.teamParams.teamNavService
					.navigateForwardToTeamPage(team, 'asset/' + asset.id, {
						replaceUrl: true,
						state: { asset, team },
					})
					.catch(
						this.teamParams.errorLogger.logErrorHandler(
							`failed to navigate to team page`,
						),
					);
			},
			error: (err) => {
				this.isSubmitting = false;
				this.teamParams.errorLogger.logError(
					err,
					'Failed to create a new asset',
				);
			},
		});
	}
}
