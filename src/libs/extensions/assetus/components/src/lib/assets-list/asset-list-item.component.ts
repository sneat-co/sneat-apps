import { Component, Inject, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AssetType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAssetContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-asset-list-item',
	template: `
		<ion-item button (click)="goAsset()">
			<ion-label>
				<h2>{{asset?.brief?.title}}</h2>
			</ion-label>
			<ion-badge *ngIf="asset?.dto?.yearOfBuild && ! asset?.brief?.regNumber" color="light"
								 style="font-weight: normal">{{asset?.dto?.yearOfBuild}}</ion-badge>
			<ion-badge *ngIf="asset?.brief?.regNumber" color="light"
								 style="font-weight: normal">{{asset?.brief?.regNumber}}</ion-badge>
			<!--<ion-buttons slot="end">-->
			<!--<ion-button (click)="add2Asset($event)">-->
			<!--<ion-icon name="add"></ion-icon>-->
			<!--</ion-button>-->
			<!--</ion-buttons>-->
		</ion-item>
	`,
})
export class AssetListItemComponent {

	@Input() team?: ITeamContext;
	@Input() assetType?: AssetType;
	@Input() asset?: IAssetContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navCtrl: NavController,
	) {
	}

	public goAsset(): void {
		const { asset } = this;
		if (!asset) {
			return;
		}
		let path: string;
		switch (asset?.brief?.type) {
			case 'vehicle':
				path = 'vehicle';
				break;
			case 'real_estate':
				path = this.team?.type === 'realtor' ? 'real-estate' : 'property';
				break;
			default:
				path = 'asset';
				break;
		}
		this.navCtrl
			.navigateForward(['space', this.team?.type, this.team?.id, 'asset', asset.id], {
				state: { asset, team: this.team },
			})
			.catch(this.errorLogger.logError);
	}
}
