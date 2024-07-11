import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import { timestamp } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team-components';
import {
	AssetVehicleType,
	EngineTypes,
	FuelTypes,
	IAssetContext,
	IAssetVehicleContext,
	IAssetVehicleExtra,
} from '@sneat/mod-assetus-core';
import { format, parseISO } from 'date-fns';
import { AssetService } from '../../services';
import { ICreateAssetRequest } from '../../services';
import { AddAssetBaseComponent } from '../add-asset-base-component';

@Component({
	selector: 'sneat-asset-add-vehicle',
	templateUrl: './asset-add-vehicle.component.html',
	providers: [TeamComponentBaseParams],
})
export class AssetAddVehicleComponent
	extends AddAssetBaseComponent
	implements OnChanges
{
	@Input() public vehicleAsset?: IAssetVehicleContext;

	protected vehicleType?: AssetVehicleType;
	protected readonly vehicleTypes: ISelectItem[] = [
		{ id: 'car', title: 'Car', iconName: 'car-outline' },
		{ id: 'motorbike', title: 'Motorbike', iconName: 'bicycle-outline' },
		// { id: 'bicycle', title: 'Bicycle', iconName: 'bicycle-outline' }, this is a sport asset
		{ id: 'boat', title: 'Boat', iconName: 'boat-outline' },
	];

	public countryIso2 = 'IE';
	public regNumber = '';
	public vin = '';
	public yearOfBuild = '';
	// public make = '';
	// public model = '';
	public engine = '';
	public engines?: string[];

	public nctExpires = ''; // ISO date string 'YYYY-MM-DD'
	public taxExpires = ''; // ISO date string 'YYYY-MM-DD'
	public nextServiceDue = ''; // ISO date string 'YYYY-MM-DD'

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team'] && this.space) {
			const a: IAssetVehicleContext = this.vehicleAsset ?? {
				id: '',
				space: this.space ?? { id: '' },
				dbo: {
					status: 'draft',
					category: 'vehicle',
					extraType: 'vehicle',
					extra: {
						make: '',
						model: '',
						engineFuel: FuelTypes.unknown,
						engineType: EngineTypes.unknown,
					},
					teamID: this.space?.id,
					type: this.vehicleType,
					possession: 'owning',
					createdAt: new Date().toISOString() as unknown as timestamp,
					createdBy: '-',
					updatedAt: new Date().toISOString() as unknown as timestamp,
					updatedBy: '-',
				},
			};
			this.vehicleAsset = { ...a, space: this.space };
		}
	}

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		assetService: AssetService,
	) {
		// super('AssetAddVehicleComponent', route, teamParams, assetService);
		super('AssetAddVehicleComponent', route, teamParams, assetService);
	}

	protected onAssetChanged(asset: IAssetContext): void {
		this.vehicleAsset = asset as IAssetVehicleContext;
	}

	onVehicleTypeChanged(): void {
		if (this.vehicleAsset?.dbo) {
			this.vehicleAsset = {
				...this.vehicleAsset,
				dbo: {
					...this.vehicleAsset.dbo,
					type: this.vehicleType,
					extraType: 'vehicle',
					extra: {
						make: '',
						model: '',
						regNumber: '',
						engineType: '',
						engineFuel: '',
					},
				},
			};
		}
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	formatDate(value?: string | string[] | null): string {
		return value && !Array.isArray(value)
			? format(parseISO(value), 'dd MMMM yyyy')
			: '';
	}

	submitVehicleForm(): void {
		console.log('submitVehicleForm', this.vehicleAsset);
		if (!this.space) {
			throw 'no team context';
		}
		if (!this.vehicleType) {
			throw 'no vehicleType';
		}
		const assetDto = this.vehicleAsset?.dbo;
		if (!assetDto) {
			throw new Error('no asset');
		}
		this.isSubmitting = true;
		let request: ICreateAssetRequest<'vehicle', IAssetVehicleExtra> = {
			asset: {
				...assetDto,
				status: 'active',
				category: 'vehicle',
			},
			spaceID: this.space?.id,
		};
		if (this.yearOfBuild) {
			request = {
				...request,
				asset: { ...request.asset, yearOfBuild: +this.yearOfBuild },
			};
		}

		// if (this.vin) {
		// 	vehicle.vin = this.vin;
		// }
		// if (this.countryIso2) {
		// 	request.countryID = this.countryIso2;
		// }
		// if (this.taxExpires) {
		// 	vehicle.taxExpires = this.taxExpires;
		// }
		// if (this.nctExpires) {
		// 	vehicle.nctExpires = this.nctExpires;
		// }
		// if (this.nextServiceDue) {
		// 	vehicle.nextServiceDue = this.nextServiceDue;
		// }

		// const { engine } = this;
		// if (engine) {
		// 	const engineLower = engine.toLowerCase();
		// 	request.engine = engine;
		// 	if (engineLower.includes('petrol')) {
		// 		request.fuelType = 'petrol';
		// 	} else if (engineLower.includes('diesel')) {
		// 		request.fuelType = 'diesel';
		// 	}
		// 	const size = engine.match(/(\d+(\.\d)?)+L/);
		// 	console.log('size:', size);
		// 	if (size) {
		// 		// tslint:disable-next-line:no-magic-numbers
		// 		request.engineCC = +size[1] * 1000;
		// 	}
		// }

		this.createAssetAndGoToAssetPage(request, this.space);
	}
}
