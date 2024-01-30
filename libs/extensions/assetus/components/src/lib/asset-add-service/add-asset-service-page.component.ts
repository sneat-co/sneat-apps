import { Component } from '@angular/core';
import { AssetBasePage, AssetComponentBaseParams } from '../asset-base-page';

@Component({
	selector: 'sneat-add-asset-service-page',
	templateUrl: './add-asset-service-page.component.html',
	providers: [AssetComponentBaseParams],
})
export class AddAssetServicePageComponent extends AssetBasePage {
	// serviceProviders: DtoServiceProvider[];
	// serviceType: LiabilityServiceType;
	serviceTypeTitle: string;

	constructor(
		assetService: IAssetService,
		private serviceProviderService: IServiceProviderService,
		params: AssetComponentBaseParams,
	) {
		super('AddAssetServicePageComponent', params);
	}

	selectProvider(serviceProvider: DtoServiceProvider): void {
		console.log('selectProvider() => id:', serviceProvider.id);
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

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
			if (!this.asset.dto.categoryId) {
				throw new Error('!this.asset.dto.categoryId');
			}
			this.setDefaultBackUrl();
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
				});
		}
	}
}
