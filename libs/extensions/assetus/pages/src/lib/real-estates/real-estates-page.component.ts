import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { AssetsListComponentModule } from '@sneat/extensions-assetus-components';
import { AssetsBasePage } from '../../assets-base.page';
import { IAssetDto } from 'sneat-shared/models/dto/dto-asset';
import { IAssetService } from 'sneat-shared/services/interfaces';
import { CommuneBasePageParams } from 'sneat-shared/services/params';

@Component({
	selector: 'sneat-real-estates',
	templateUrl: './real-estates-page.component.html',
	providers: [CommuneBasePageParams],
	imports: [
		IonToolbar,
		IonButtons,
		IonHeader,
		IonBackButton,
		IonTitle,
		IonButton,
		IonIcon,
		IonContent,
		IonItem,
		IonInput,
		FormsModule,
		NgIf,
		AssetsListComponentModule,
	],
})
export class RealEstatesPageComponent extends AssetsBasePage {
	filter: string;

	constructor(params: CommuneBasePageParams, assetService: IAssetService) {
		super(params, assetService);
	}

	protected setAssets(assets: IAssetDto[]): void {
		this.assets = assets.filter((a) => a.categoryId === 'real_estate');
	}

	clearFilter(): void {
		this.filter = '';
	}

	filterChanged(event: Event): void {
		console.log(this.filter, event);
	}
}
