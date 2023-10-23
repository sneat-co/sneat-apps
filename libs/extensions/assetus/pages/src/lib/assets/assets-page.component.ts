import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { IIdAndBrief } from '@sneat/core';
import { IAssetBrief, IAssetCategory } from '@sneat/dto';
import {
	AssetService,
	AssetsListComponentModule,
	AssetusServicesModule,
	AssetusTeamService,
} from '@sneat/extensions/assetus/components';
import {
	TeamComponentBaseParams,
	TeamCoreComponentsModule,
} from '@sneat/team-components';
import { IAssetContext } from '@sneat/team-models';
import { takeUntil } from 'rxjs';
import { AssetsBasePage } from '../assets-base.page';

@Component({
	selector: 'sneat-assets-page',
	templateUrl: './assets-page.component.html',
	providers: [TeamComponentBaseParams],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		AssetsListComponentModule,
		TeamCoreComponentsModule,
		ContactusServicesModule,
		AssetusServicesModule,
	],
})
export class AssetsPageComponent extends AssetsBasePage /*implements AfterViewInit*/ {
	public vehicles?: IAssetContext[];

	assetTypes: IAssetCategory[] = [
		{ id: 'vehicle', title: 'Vehicles', iconName: 'car-outline' },
		{ id: 'real_estate', title: 'Real estates', iconName: 'home-outline' },
	];

	// ngOnInit(): void {
	//     super.ngOnInit();
	//     this.assetService.watchByCommuneId(this.communeRealId).subscribe(assets => {
	//         this.assets = assets;
	//         this.vehicles = assets.filter(a => a.categoryId === 'vehicles');
	//     });
	// }
	public segment: 'all' | 'byCategory' = 'byCategory';

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private readonly assetusTeamService: AssetusTeamService,
		assetService: AssetService,
		private readonly alertCtrl: AlertController,
	) {
		super('AssetsPageComponent', route, params, assetService);
		this.teamIDChanged$.subscribe({
			next: () => this.watchTeamAssets(),
		});
	}

	// ngAfterViewInit(): void {
	// 	this.setTeamPageContext(this.teamPageContext);
	// }

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
				state: { team: this.team },
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to navigate to page: ' + page),
			);
		// this.navigateForward(page);
	}

	private watchTeamAssets(): void {
		if (this.team?.id) {
			this.assetusTeamService
				.watchAssetBriefs(this.team)
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: (assets: IIdAndBrief<IAssetBrief>[]) => {
						console.log(
							'AssetsPageComponent.onTeamIdChanged() => assets:',
							assets,
						);
						this.assets = assets;
					},
					error: this.errorLogger.logErrorHandler('failed to get team assets'),
				});
		}
	}
}
