import {Component, Input} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Commune} from 'sneat-shared/models/ui/ui-models';
import {IAssetDto} from 'sneat-shared/models/dto/dto-asset';
import {IErrorLogger} from '../../../../services/interfaces';

@Component({
	selector: 'asset-list-item',
	template: `
		<ion-item button (click)="goAsset(asset)">
			<ion-label>
				<h2>{{asset.title}}</h2>
			</ion-label>
			<ion-badge *ngIf="asset['yearBuild'] && ! asset.number" color="light"
						  style="font-weight: normal">{{asset['yearBuild']}}</ion-badge>
			<ion-badge *ngIf="asset.number" color="light" style="font-weight: normal">{{asset.number}}</ion-badge>
			<!--<ion-buttons slot="end">-->
			<!--<ion-button (click)="add2Asset($event)">-->
			<!--<ion-icon name="add"></ion-icon>-->
			<!--</ion-button>-->
			<!--</ion-buttons>-->
		</ion-item>
	`,
})
export class AssetListItemComponent {

	constructor(
		private readonly errorLogger: IErrorLogger,
		private readonly navCtrl: NavController,
	) {
	}

	@Input() commune: Commune;
	@Input() category: string;
	@Input() asset: IAssetDto;

	public goAsset(assetDto: IAssetDto): void {
		let path: string;
		switch (assetDto.categoryId) {
			case 'vehicles':
				path = 'vehicle';
				break;
			case 'real_estate':
				path = this.commune.type === 'realtor' ? 'real-estate' : 'property';
				break;
			default:
				path = 'asset';
				break;
		}
		this.navCtrl
			.navigateForward([path], {
				queryParams: {id: assetDto.id},
				state: {assetDto, communeDto: this.commune.dto},
			})
			.catch(this.errorLogger.logError);
	}
}
