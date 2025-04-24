import { Component, inject, Inject, InjectionToken } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { AssetExtraType, IAssetExtra } from '@sneat/mod-assetus-core';
import { SpaceBaseComponent } from '@sneat/space-components';
import { ISpaceContext } from '@sneat/space-models';
import { AssetService, ICreateAssetRequest } from '../services';

@Component({
	template: '',
})
export abstract class AddAssetBaseComponent extends SpaceBaseComponent {
	public static readonly metadata = {
		inputs: ['space'],
	};

	public contactusSpace?: IContactusSpaceDboAndID;
	public country?: string;

	public isSubmitting = false;

	public titleForm = new UntypedFormGroup({
		title: new FormControl<string>('', Validators.required),
	});

	protected readonly assetService = inject(AssetService);

	protected constructor(
		@Inject(new InjectionToken('className')) className: string,
	) {
		super(className);
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
