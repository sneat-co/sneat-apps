import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { LiabilityServiceType } from '@sneat/mod-assetus-core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { AssetBasePage } from '../../asset-base.page';

@Component({
	selector: 'sneat-select-service-provider',
	templateUrl: './select-service-provider-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		FormsModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonTitle,
		IonContent,
		IonItemGroup,
		IonLabel,
		IonItem,
		IonIcon,
		IonItemDivider,
		IonInput,
		IonBackButton,
	],
})
export class SelectServiceProviderPageComponent extends AssetBasePage {
	serviceProviders?: DtoServiceProvider[];
	isOtherSelected = false;
	serviceType?: LiabilityServiceType;
	serviceTypeTitle?: string;

	constructor(
		// assetService: IAssetService,
		// private serviceProviderService: IServiceProviderService,
		params: SpaceComponentBaseParams,
	) {
		super(CommuneTopPage.asset, params, assetService);
	}

	protected onCommuneIdsChanged(communeIds: ICommuneIds): void {
		super.onCommuneIdsChanged(communeIds);
		this.route.queryParamMap.subscribe((params) => {
			this.serviceType = params.get('type') as LiabilityServiceType;
			this.serviceTypeTitle = this.serviceType;
			console.log('serviceType:', this.serviceType);
		});
	}

	protected defaultBackParams(url: string): string {
		if (this.asset) {
			return `${url}?asset=${this.asset.dto.id}`;
		}
		return super.defaultBackParams(url);
	}

	protected setAssetDto(assetDto: IAssetDto): void {
		super.setAssetDto(assetDto);
		if (this.asset) {
			this.setDefaultBackUrl();
			if (!this.asset.dto.categoryId) {
				throw new Error('!this.asset.dto.categoryId');
			}
			this.serviceProviderService
				.getServiceProvidersByAssetCategoryId(
					undefined,
					'ie',
					this.asset.dto.categoryId,
				)
				.subscribe((result) => {
					console.log('serviceProviders:', result.values);
					const serviceType = this.serviceType;
					this.serviceProviders = this.serviceType
						? result.values.filter(
								(v) => v.serviceTypes && v.serviceTypes.includes(serviceType),
							)
						: result.values;
				}, this.errorLogger.logError);
		}
	}

	selectProvider(serviceProvider: DtoServiceProvider): void {
		console.log('selectProvider() => id:', serviceProvider.id);
	}

	other(): void {
		this.isOtherSelected = true;
	}
}
