import { Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { AssetBasePage, AssetComponentBaseParams } from '../asset-base-page';

@Component({
	selector: 'sneat-add-asset-service-page',
	templateUrl: './add-asset-service-page.component.html',
	providers: [AssetComponentBaseParams],
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
		IonItemGroup,
		IonItemDivider,
		IonLabel,
		IonItem,
		IonIcon,
	],
})
export class AddAssetServicePageComponent extends AssetBasePage {
	private serviceProviderService = inject(IServiceProviderService);

	// serviceProviders: DtoServiceProvider[];
	// serviceType: LiabilityServiceType;
	serviceTypeTitle: string;

	constructor() {
		const params = inject(AssetComponentBaseParams);

		super('AddAssetServicePageComponent', params);
	}

	selectProvider(serviceProvider: DtoServiceProvider): void {
		console.log('selectProvider() => id:', serviceProvider.id);
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
			return `${url}?asset=${this.asset.dbo.id}`;
		}
		return super.defaultBackParams(url);
	}

	protected setAssetDto(assetDto: IAssetDto): void {
		super.setAssetDto(assetDto);
		if (this.asset) {
			if (!this.asset.dbo.categoryId) {
				throw new Error('!this.asset.dto.categoryId');
			}
			this.setDefaultBackUrl();
			this.serviceProviderService
				.getServiceProvidersByAssetCategoryId(
					undefined,
					'ie',
					this.asset.dbo.categoryId,
				)
				.subscribe((result) => {
					console.log('serviceProviders:', result.values);
					const serviceType = this.serviceType;
					this.serviceProviders = this.serviceType
						? result.values.filter(
								(v) => v.serviceTypes && v.serviceTypes.includes(serviceType),
							)
						: result.values;
				});
		}
	}
}
