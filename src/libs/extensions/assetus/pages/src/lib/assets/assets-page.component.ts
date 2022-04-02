import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TeamComponentBaseParams, TeamContextComponent } from '@sneat/team/components';
import { IAssetContext } from '@sneat/team/models';
import { AssetsBasePage } from '../assets-base.page';

@Component({
	selector: 'sneat-assets-page',
	templateUrl: './assets-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class AssetsPageComponent extends AssetsBasePage implements AfterViewInit {

	@ViewChild('teamPageContext')
	public teamPageContext?: TeamContextComponent;

	public vehicles?: IAssetContext[];

	// ngOnInit(): void {
	//     super.ngOnInit();
	//     this.assetService.watchByCommuneId(this.communeRealId).subscribe(assets => {
	//         this.assets = assets;
	//         this.vehicles = assets.filter(a => a.categoryId === 'vehicles');
	//     });
	// }
	public segment: 'all' | 'byCategory' = 'byCategory';

	constructor(
		params: TeamComponentBaseParams,
		// assetService: IAssetService,
		private readonly alertCtrl: AlertController,
	) {
		super('', params);
	}

	ngAfterViewInit(): void {
		this.setTeamPageContext(this.teamPageContext);
	}

	public add2Asset(event: Event): void {
		event.stopPropagation();
		const alert$ = this.alertCtrl.create({
			header: 'Add to asset',
			buttons: [
				{
					text: 'Contact', handler: () => {
						this.go('new-contact');
					},
				},
				{
					text: 'Member', handler: () => {
						this.go('new-member');
					},
				},
				{
					text: 'Expense', handler: () => {
						this.go('new-liability');
					},
				},
				{
					text: 'Income', handler: () => {
						this.go('new-liability');
					},
				},
				{ role: 'cancel', text: 'Cancel' },
			],
		});
		alert$
			.then((alert) => {
				alert.present()
					.catch(this.errorLogger.logError);
			})
			.catch(this.errorLogger.logError);
	}

	public go(page: 'new-liability' | 'new-member' | 'new-contact'): void {
		throw new Error('not implemented yey');
		this.navController.navigateForward('./' + page, {
			state: {team: this.team},
		})
		// this.navigateForward(page);
	}
}
