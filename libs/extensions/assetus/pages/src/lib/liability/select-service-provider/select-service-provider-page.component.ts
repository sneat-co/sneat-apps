import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IRecord } from '@sneat/data';
import { DtoServiceProvider } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team-components';

@Component({
	selector: 'sneat-select-service-provider',
	templateUrl: './select-service-provider-page.component.html',
	providers: [TeamComponentBaseParams],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule],
})
export class SelectServiceProviderPageComponent extends AssetBasePage {
	serviceProviders: DtoServiceProvider[];
	isOtherSelected: boolean;
	serviceType: LiabilityServiceType;
	serviceTypeTitle: string;

	constructor(
		// assetService: IAssetService,
		// private serviceProviderService: IServiceProviderService,
		params: TeamComponentBaseParams,
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

	// tslint:disable-next-line:prefer-function-over-method
	selectProvider(serviceProvider: DtoServiceProvider): void {
		console.log('selectProvider() => id:', serviceProvider.id);
	}

	other(): void {
		this.isOtherSelected = true;
	}

	trackById = (i: number, record: IRecord<unknown>) => record.id;
}
