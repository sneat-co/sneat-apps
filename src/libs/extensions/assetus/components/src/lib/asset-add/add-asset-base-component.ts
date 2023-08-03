import { Component, Inject, InjectionToken, OnDestroy } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IAssetDbData, IAssetMainData } from '@sneat/dto';
import { IErrorLogger } from '@sneat/logging';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IContactusTeamContext, ITeamContext } from '@sneat/team/models';
import { Subject } from 'rxjs';
import { AssetService } from '../asset-service';
import { ICreateAssetRequest } from '../asset-service.dto';

// import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Component({ template: '' })
export abstract class AddAssetBaseComponent /*extends TeamBaseComponent*/ implements OnDestroy {

	public team?: ITeamContext; // intentionally public as will be overridden as @Input() in child components
	public contactusTeam?: IContactusTeamContext;
	public country?: string;

	protected readonly destroyed = new Subject<void>();

	public isSubmitting = false;

	public titleForm = new UntypedFormGroup({
		title: new FormControl<string>('', Validators.required),
	});

	protected constructor(
		@Inject(new InjectionToken('className')) protected readonly className: string,
		protected readonly route: ActivatedRoute,
		protected teamParams: TeamComponentBaseParams,
		protected readonly assetService: AssetService,
	) {
		// super(className, route, teamParams);
	}

	ngOnDestroy(): void {
		this.destroyed.next();
	}

	protected get errorLogger(): IErrorLogger {
		return this.teamParams.errorLogger;
	}

	protected createAssetAndGoToAssetPage<A extends IAssetMainData, D extends IAssetDbData>(request: ICreateAssetRequest<A>, team: ITeamContext): void {
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
