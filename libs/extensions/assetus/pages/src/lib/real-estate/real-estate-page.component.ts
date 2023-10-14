import { Component } from '@angular/core';
import { CommuneBasePageParams } from 'sneat-shared/services/params';
import { ContactType } from 'sneat-shared/models/types';
import { AssetBasePage } from '../../asset-base.page';
import { IAssetDto } from 'sneat-shared/models/dto/dto-asset';
import { IAssetService } from 'sneat-shared/services/interfaces';
import { IContact2Asset } from 'sneat-shared/models/dto/dto-contact';

@Component({
	selector: 'sneat-real-estate',
	templateUrl: './real-estate-page.component.html',
	providers: [CommuneBasePageParams],
})
export class RealEstatePageComponent extends AssetBasePage {
	constructor(params: CommuneBasePageParams, assetService: IAssetService) {
		super('real-estates', params, assetService);
	}

	landlords: IContact2Asset[];
	tenants: IContact2Asset[];

	protected setAssetDto(assetDto: IAssetDto): void {
		super.setAssetDto(assetDto);
		if (assetDto) {
			if (assetDto.contacts) {
				this.landlords = assetDto.contacts.filter(
					(c) => c.relation === 'landlord',
				);
				this.tenants = assetDto.contacts.filter((c) => c.relation === 'tenant');
			} else {
				this.landlords = [];
				this.tenants = [];
			}
		}
	}

	goNewContact(type: ContactType): void {
		if (!this.asset) {
			throw new Error('!this.asset');
		}
		this.navigateForward(
			'new-contact',
			{ type, asset: this.asset.id },
			{ assetDto: this.asset.dto },
			{ excludeCommuneId: true },
		);
	}
}
