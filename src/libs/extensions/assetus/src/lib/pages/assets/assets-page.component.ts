import {Component} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {AssetsBasePage} from '../../assets-base.page';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {IAssetService} from 'sneat-shared/services/interfaces';
import {IAssetDto} from 'sneat-shared/models/dto/dto-asset';

@Component({
	selector: 'app-assets',
	templateUrl: './assets-page.component.html',
	providers: [CommuneBasePageParams],
})
export class AssetsPageComponent extends AssetsBasePage {

	constructor(
		params: CommuneBasePageParams,
		assetService: IAssetService,
		private readonly alertCtrl: AlertController,
	) {
		super(params, assetService);
	}

	// ngOnInit(): void {
	//     super.ngOnInit();
	//     this.assetService.watchByCommuneId(this.communeRealId).subscribe(assets => {
	//         this.assets = assets;
	//         this.vehicles = assets.filter(a => a.categoryId === 'vehicles');
	//     });
	// }

	public vehicles: IAssetDto[];
	public segment: 'all' | 'byCategory' = 'byCategory';

	public add2Asset(event: Event): void {
		event.stopPropagation();
		const alert$ = this.alertCtrl.create({
			header: 'Add to asset',
			buttons: [
				{
					text: 'Contact', handler: () => {
						this.go('new-contact');
					}
				},
				{
					text: 'Member', handler: () => {
						this.go('new-member');
					}
				},
				{
					text: 'Expense', handler: () => {
						this.go('new-liability');
					}
				},
				{
					text: 'Income', handler: () => {
						this.go('new-liability');
					}
				},
				{role: 'cancel', text: 'Cancel'},
			]
		});
		alert$
			.then((alert) => {
				alert.present()
					.catch(this.errorLogger.logError);
			})
			.catch(this.errorLogger.logError);
	}

	public go(page: 'new-liability' | 'new-member' | 'new-contact'): void {
		this.navigateForward(page);
	}
}
