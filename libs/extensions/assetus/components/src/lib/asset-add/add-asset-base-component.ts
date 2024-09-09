import { Component, Inject, InjectionToken, Input } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { AssetExtraType, IAssetExtra } from '@sneat/mod-assetus-core';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { ISpaceContext } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { AssetService } from '../services';
import { ICreateAssetRequest } from '../services';

@Component({ template: '' })
export abstract class AddAssetBaseComponent extends SneatBaseComponent {
	@Input({ required: true }) space?: ISpaceContext;

	public static readonly metadata = {
		inputs: ['space'],
	};

	public contactusSpace?: IContactusSpaceDboAndID;
	public country?: string;

	public isSubmitting = false;

	public titleForm = new UntypedFormGroup({
		title: new FormControl<string>('', Validators.required),
	});

	protected constructor(
		@Inject(new InjectionToken('className')) className: string,
		protected readonly route: ActivatedRoute,
		protected spaceParams: SpaceComponentBaseParams,
		protected readonly assetService: AssetService,
	) {
		super(className, spaceParams.errorLogger);
	}

	protected createAssetAndGoToAssetPage<
		ExtraType extends AssetExtraType,
		Extra extends IAssetExtra,
	>(
		request: ICreateAssetRequest<ExtraType, Extra>,
		space: ISpaceContext,
	): void {
		if (!this.space) {
			throw new Error('no team context');
		}
		this.assetService
			.createAsset<ExtraType, Extra>(this.space, request)
			.subscribe({
				next: (asset) => {
					this.spaceParams.spaceNavService
						.navigateForwardToSpacePage(space, 'asset/' + asset.id, {
							replaceUrl: true,
							state: { asset, space },
						})
						.catch(
							this.spaceParams.errorLogger.logErrorHandler(
								`failed to navigate to team page`,
							),
						);
				},
				error: (err) => {
					this.isSubmitting = false;
					this.spaceParams.errorLogger.logError(
						err,
						'Failed to create a new asset',
					);
				},
			});
	}
}
