import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import { timestamp } from '@sneat/dto';
import {
	AssetRealEstateType,
	IAssetContext,
	IAssetDwellingContext,
	IAssetDwellingExtra,
} from '@sneat/mod-assetus-core';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { ICreateAssetRequest } from '../../services';
import { AssetService } from '../../services/asset-service';
import { AddAssetBaseComponent } from '../add-asset-base-component';

@Component({
	selector: 'sneat-asset-add-dwelling',
	templateUrl: './asset-add-dwelling.component.html',
	providers: [SpaceComponentBaseParams],
	standalone: false,
})
export class AssetAddDwellingComponent
	extends AddAssetBaseComponent
	implements OnChanges
{
	@Input() public dwellingAsset?: IAssetDwellingContext;

	protected dwellingType?: AssetRealEstateType;
	protected readonly dwellingTypes: ISelectItem[] = [
		{ id: 'house', title: 'House', iconName: 'home-outline' },
		{ id: 'apartment', title: 'Apartment', iconName: 'business-outline' },
		{ id: 'room', title: 'Room', iconName: 'storefront-outline' },
	];

	constructor(
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		assetService: AssetService,
	) {
		super('AssetAddDwellingComponent', route, teamParams, assetService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['space'] && this.space) {
			this.dwellingAsset = this.dwellingAsset ?? {
				id: '',
				space: this.space ?? { id: '' },
				dbo: {
					status: 'draft',
					category: 'dwelling',
					extraType: 'dwelling',
					extra: {
						rent_price: { value: 0, currency: 'USD' },
					},
					spaceID: this.space?.id,
					type: this.dwellingType,
					title: 'My dwelling',
					possession: 'owning',
					createdAt: new Date().toISOString() as unknown as timestamp,
					createdBy: '-',
					updatedAt: new Date().toISOString() as unknown as timestamp,
					updatedBy: '-',
				},
			};
		}
	}

	protected onDwellingTypeChanged(): void {
		if (this.dwellingAsset?.dbo) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dbo: {
					...this.dwellingAsset.dbo,
					type: this.dwellingType,
				},
			};
		}
	}

	protected onAssetChanged(asset: IAssetContext): void {
		this.dwellingAsset = asset as IAssetDwellingContext;
	}

	protected submitDwellingForm(): void {
		console.log('submitDwellingForm', this.dwellingAsset);
		if (!this.space) {
			throw new Error('no team context');
		}
		if (!this.dwellingAsset) {
			throw new Error('no dwellingType');
		}
		const assetDto = this.dwellingAsset?.dbo;
		if (!assetDto) {
			throw new Error('no asset');
		}
		this.isSubmitting = true;

		if (assetDto.extra) {
			if (assetDto.extra.numberOfBedrooms)
				assetDto.extra.numberOfBedrooms = +assetDto.extra?.numberOfBedrooms;
			if (assetDto.extra.areaSqM)
				assetDto.extra.areaSqM = +assetDto.extra?.areaSqM;
		}

		const request: ICreateAssetRequest<'dwelling', IAssetDwellingExtra> = {
			asset: {
				...assetDto,
				status: 'active',
				category: 'dwelling',
			},
			spaceID: this.space?.id,
		};

		this.createAssetAndGoToAssetPage(request, this.space);
	}
}
