import {Component} from '@angular/core';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {IAssetService, ICommuneIds, IServiceProviderService} from 'sneat-shared/services/interfaces';
import {AssetBasePage} from '../../asset-base.page';
import {LiabilityServiceType} from 'sneat-shared/models/types';
import {IAssetDto} from 'sneat-shared/models/dto/dto-asset';
import {IRecord} from 'rxstore';
import {DtoServiceProvider} from 'sneat-shared/models/dto/dto-service-provider';
import {CommuneTopPage} from '../../../../pages/constants';

@Component({
	selector: 'app-add-asset-service',
	templateUrl: './add-asset-service-page.component.html',
	providers: [CommuneBasePageParams],
})
export class AddAssetServicePageComponent extends AssetBasePage {

	serviceProviders: DtoServiceProvider[];

	constructor(
		assetService: IAssetService,
		private serviceProviderService: IServiceProviderService,
		params: CommuneBasePageParams,
	) {
		super(CommuneTopPage.asset, params, assetService);
	}

	serviceType: LiabilityServiceType;
	serviceTypeTitle: string;

	protected onCommuneIdsChanged(communeIds: ICommuneIds): void {
		super.onCommuneIdsChanged(communeIds);
		this.route.queryParamMap.subscribe(params => {
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
			this.serviceProviderService.getServiceProvidersByAssetCategoryId(undefined, 'ie', this.asset.dto.categoryId)
				.subscribe(result => {
					console.log('serviceProviders:', result.values);
					const serviceType = this.serviceType;
					this.serviceProviders = this.serviceType ?
						result.values.filter(v => v.serviceTypes && v.serviceTypes.includes(serviceType)) :
						result.values;
				});
		}
	}

	// tslint:disable-next-line:prefer-function-over-method
	selectProvider(serviceProvider: DtoServiceProvider): void {
		console.log('selectProvider() => id:', serviceProvider.id);
	}

	trackById = (o: number, record: IRecord) => record.id;
}
