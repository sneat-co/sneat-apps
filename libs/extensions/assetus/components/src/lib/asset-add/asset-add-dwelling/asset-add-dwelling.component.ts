import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { AssetService } from '../../services/asset-service';
import { AddAssetBaseComponent } from '../add-asset-base-component';
import {
	AssetRealEstateType,
	IAssetContext,
	IAssetDwellingContext,
	IAssetDwellingExtra,
} from '@sneat/mod-assetus-core';
import { timestamp } from '@sneat/dto';
import { ICreateAssetRequest } from '../../services';

@Component({
	selector: 'sneat-asset-add-dwelling',
	templateUrl: './asset-add-dwelling.component.html',
	providers: [TeamComponentBaseParams],
})
export class AssetAddDwellingComponent
	extends AddAssetBaseComponent
	implements OnChanges
{
	protected readonly id = (_: number, o: { id: string }) => o.id;

	@Input() public dwellingAsset?: IAssetDwellingContext;

	protected dwellingType?: AssetRealEstateType;
	protected readonly dwellingTypes: ISelectItem[] = [
		{ id: 'house', title: 'House', iconName: 'home-outline' },
		{ id: 'apartment', title: 'Apartment', iconName: 'business-outline' },
		{ id: 'room', title: 'Room', iconName: 'storefront-outline' },
	];

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		assetService: AssetService,
	) {
		super('AssetAddDwellingComponent', route, teamParams, assetService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team'] && this.team) {
			const a: IAssetDwellingContext = this.dwellingAsset ?? {
				id: '',
				team: this.team ?? { id: '' },
				dto: {
					status: 'draft',
					category: 'dwelling',
					extraType: 'dwelling',
					extra: {
						type: 'dwelling',
						address: '',
						rent_price: { value: 0, currency: 'USD' },
					},
					teamID: this.team?.id,
					type: this.dwellingType,
					title: 'My dwelling',
					possession: 'owning',
					createdAt: new Date().toISOString() as unknown as timestamp,
					createdBy: '-',
					updatedAt: new Date().toISOString() as unknown as timestamp,
					updatedBy: '-',
				},
			};
			this.dwellingAsset = a;
		}
	}

	onDwellingTypeChanged(): void {
		if (this.dwellingAsset?.dto) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dto: {
					...this.dwellingAsset.dto,
					type: this.dwellingType,
				},
			};
		}
	}

	protected onAssetChanged(asset: IAssetContext): void {
		this.dwellingAsset = asset as IAssetDwellingContext;
	}

	submitDwellingForm(): void {
		console.log('submitDwellingForm', this.dwellingAsset);
		if (!this.team) {
			throw 'no team context';
		}
		if (!this.dwellingAsset) {
			throw 'no dwellingType';
		}
		const assetDto = this.dwellingAsset?.dto;
		if (!assetDto) {
			throw new Error('no asset');
		}
		this.isSubmitting = true;
		const request: ICreateAssetRequest<'dwelling', IAssetDwellingExtra> = {
			asset: {
				...assetDto,
				status: 'active',
				category: 'dwelling',
			},
			teamID: this.team?.id,
		};

		this.createAssetAndGoToAssetPage(request, this.team);
	}
}
