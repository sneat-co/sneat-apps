import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { IIdAndBrief } from '@sneat/core';
import { IAssetBrief, IAssetCategory } from '@sneat/mod-assetus-core';
import {
	AssetService,
	AssetsListComponentModule,
	AssetusServicesModule,
	AssetusSpaceService,
} from '@sneat/extensions-assetus-components';
import {
	SpaceComponentBaseParams,
	SpacePageTitleComponent,
} from '@sneat/space-components';
import { IAssetContext } from '@sneat/mod-assetus-core';
import { SpaceServiceModule } from '@sneat/space-services';
import { takeUntil } from 'rxjs';
import { AssetsBasePage } from '../assets-base.page';

@Component({
	selector: 'sneat-assets-page',
	templateUrl: './assets-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule,
		AssetsListComponentModule,
		SpacePageTitleComponent,
		ContactusServicesModule,
		AssetusServicesModule,
		SpaceServiceModule,
	],
}) /*implements AfterViewInit*/
export class AssetsPageComponent extends AssetsBasePage implements OnInit {
	public vehicles?: IAssetContext[];

	protected readonly assetTypes: IAssetCategory[] = [
		{ id: 'vehicle', title: 'Vehicles', iconName: 'car-outline' },
		{ id: 'dwelling', title: 'Real estates', iconName: 'home-outline' },
	];

	public segment: 'all' | 'byCategory' = 'byCategory';

	constructor(
		private readonly assetusSpaceService: AssetusSpaceService,
		assetService: AssetService,
		private readonly alertCtrl: AlertController,
	) {
		super('AssetsPageComponent', assetService);
	}

	override ngOnInit(): void {
		super.ngOnInit();
		this.spaceIDChanged$.pipe(this.takeUntilDestroyed()).subscribe({
			next: () => this.watchSpaceAssets(),
		});
	}

	public add2Asset(event: Event): void {
		event.stopPropagation();
		const alert$ = this.alertCtrl.create({
			header: 'Add to asset',
			buttons: [
				{
					text: 'Contact',
					handler: () => {
						this.go('new-contact');
					},
				},
				{
					text: 'Member',
					handler: () => {
						this.go('new-member');
					},
				},
				{
					text: 'Expense',
					handler: () => {
						this.go('new-liability');
					},
				},
				{
					text: 'Income',
					handler: () => {
						this.go('new-liability');
					},
				},
				{ role: 'cancel', text: 'Cancel' },
			],
		});
		alert$
			.then((alert) => {
				alert.present().catch(this.errorLogger.logError);
			})
			.catch(this.errorLogger.logError);
	}

	public go(page: 'new-liability' | 'new-member' | 'new-contact'): void {
		// throw new Error("not implemented yey");
		this.navController
			.navigateForward('./' + page, {
				state: { space: this.space },
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to navigate to page: ' + page),
			);
		// this.navigateForward(page);
	}

	private watchSpaceAssets(): void {
		if (this.space?.id) {
			this.assetusSpaceService
				.watchAssetBriefs(this.space)
				.pipe(takeUntil(this.destroyed$))
				.subscribe({
					next: (assets: IIdAndBrief<IAssetBrief>[]) => {
						console.log(
							'AssetsPageComponent.onTeamIdChanged() => assets:',
							assets,
						);
						this.assets = assets;
					},
					error: (err) => {
						const errStr: string = err.toString();
						console.log(
							'AssetsPageComponent.onTeamIdChanged() => error:',
							errStr,
						);
						if (err.code === 'permission-denied') {
							this.noPermissions = true;
							this.assets = [];
							return;
						}
						this.errorLogger.logError(err, 'failed to get team assets');
					},
				});
		}
	}
}
