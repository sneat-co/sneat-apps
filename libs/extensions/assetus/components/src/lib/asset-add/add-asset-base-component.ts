import { Component, Inject, InjectionToken, Input } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { AssetExtraType, IAssetExtra } from '@sneat/mod-assetus-core';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { ISpaceContext } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { AssetService } from '../services';
import { ICreateAssetRequest } from '../services';

@Component({ template: '' })
export abstract class AddAssetBaseComponent extends SneatBaseComponent {
	@Input({ required: true }) team?: ISpaceContext;

	public static readonly metadata = {
		inputs: ['team'],
	};

	public contactusTeam?: IContactusSpaceDboAndID;
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
		ExtraType extends AssetExtraType,
		Extra extends IAssetExtra,
	>(request: ICreateAssetRequest<ExtraType, Extra>, team: ISpaceContext): void {
		if (!this.team) {
			throw new Error('no team context');
		}
		this.assetService
			.createAsset<ExtraType, Extra>(this.team, request)
			.subscribe({
				next: (asset) => {
					this.teamParams.teamNavService
						.navigateForwardToSpacePage(team, 'asset/' + asset.id, {
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
