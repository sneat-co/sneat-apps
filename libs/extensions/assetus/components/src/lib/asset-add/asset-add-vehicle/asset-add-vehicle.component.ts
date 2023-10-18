import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import {
	AssetPossession,
	AssetVehicleType,
	EngineTypes,
	FuelTypes,
	IVehicleAssetDto,
	IVehicleMainData,
	timestamp,
} from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ITeamContext, IVehicleAssetContext } from '@sneat/team/models';
import { format, parseISO } from 'date-fns';
import { AssetService } from '../../services/asset-service';
import { ICreateAssetRequest } from '../../services/asset-service.dto';
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
	@Input() public override team?: ITeamContext;
	@Input() public vehicleAsset?: IVehicleAssetContext;

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
		if (changes['team'] && this.team) {
			const a: IVehicleAssetContext = this.vehicleAsset ?? {
				id: '',
				team: this.team ?? { id: '' },
				dto: {
					status: 'draft',
					category: 'vehicle',
					teamID: this.team?.id,
					type: this.vehicleType,
					title: '',
					make: '',
					model: '',
					engineFuel: FuelTypes.unknown,
					engineType: EngineTypes.unknown,
					possession: undefined as unknown as AssetPossession,
					createdAt: new Date().toISOString() as unknown as timestamp,
					createdBy: '-',
					updatedAt: new Date().toISOString() as unknown as timestamp,
					updatedBy: '-',
				},
			};
			this.vehicleAsset = { ...a, team: this.team };
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

	protected onAssetChanged(asset: IVehicleAssetContext): void {
		console.log('onAssetChanged', asset, this.vehicleAsset);
	}

	onVehicleTypeChanged(): void {
		if (this.vehicleAsset?.dto) {
			this.vehicleAsset = {
				...this.vehicleAsset,
				dto: {
					...this.vehicleAsset.dto,
					type: this.vehicleType,
					make: '',
					model: '',
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
		if (!this.team) {
			throw 'no team context';
		}
		if (!this.vehicleType) {
			throw 'no vehicleType';
		}
		const assetDto = this.vehicleAsset?.dto;
		if (!assetDto) {
			throw new Error('no asset');
		}
		this.isSubmitting = true;
		let request: ICreateAssetRequest<IVehicleMainData> = {
			asset: {
				...assetDto,
				status: 'active',
				category: 'vehicle',
			},
			teamID: this.team?.id,
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

		// tslint:disable-next-line:no-this-assignment
		// const { engine } = this;
		// if (engine) {
		// 	const engineLower = engine.toLowerCase();
		// 	request.engine = engine;
		// 	if (engineLower.indexOf('petrol') >= 0) {
		// 		request.fuelType = 'petrol';
		// 	} else if (engineLower.indexOf('diesel') >= 0) {
		// 		request.fuelType = 'diesel';
		// 	}
		// 	const size = engine.match(/(\d+(\.\d)?)+L/);
		// 	console.log('size:', size);
		// 	if (size) {
		// 		// tslint:disable-next-line:no-magic-numbers
		// 		request.engineCC = +size[1] * 1000;
		// 	}
		// }

		this.createAssetAndGoToAssetPage<IVehicleMainData, IVehicleAssetDto>(
			request,
			this.team,
		);
	}
}