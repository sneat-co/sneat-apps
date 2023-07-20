import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ISelectItem } from '@sneat/components';
import { AssetVehicleType, IVehicleAssetContext } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ITeamContext } from '@sneat/team/models';
import { format, parseISO } from 'date-fns';
import { AssetService } from '../../asset-service';
import { ICreateVehicleAssetRequest } from '../../asset-service.dto';
import { AddAssetBaseComponent } from '../add-asset-base-component';

@Component({
	selector: 'sneat-asset-add-vehicle',
	templateUrl: './asset-add-vehicle.component.html',
	providers: [TeamComponentBaseParams],
})
export class AssetAddVehicleComponent extends AddAssetBaseComponent implements OnChanges {

	@Input() override team?: ITeamContext;

	vehicleType?: AssetVehicleType;
	vehicleTypes: ISelectItem[] = [
		{ id: 'car', title: 'Car', iconName: 'car-outline' },
		{ id: 'motorbike', title: 'Motorbike', iconName: 'bicycle-outline' },
		{ id: 'bicycle', title: 'Bicycle', iconName: 'bicycle-outline' },
		{ id: 'boat', title: 'Boat', iconName: 'boat-outline' },
	];

	public asset?: IVehicleAssetContext;

	public countryIso2 = 'IE';
	public regNumber = '';
	public vin = '';
	public yearOfBuild = '';
	// public make = '';
	// public model = '';
	public engine = '';
	public engines?: string[];

	public nctExpires = '';       // ISO date string 'YYYY-MM-DD'
	public taxExpires = '';      // ISO date string 'YYYY-MM-DD'
	public nextServiceDue = '';  // ISO date string 'YYYY-MM-DD'

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team'] && this.team) {
			const a: IVehicleAssetContext = this.asset
				?? { id: '', team: this.team ?? { id: '' }, dto: { category: 'vehicle', type: this.vehicleType, title: '' } };
			this.asset = { ...a, team: this.team };
		}
	}

	constructor(
		teamParams: TeamComponentBaseParams,
		assetService: AssetService,
	) {
		super(teamParams, assetService);
	}


	onVehicleTypeChanged(): void {
		if (this.asset?.dto) {
			this.asset = {
				...this.asset, dto: {
					...this.asset.dto,
					type: this.vehicleType,
					make: '',
					model: '',
				},
			};
		}
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	formatDate(value?: string | string[] | null): string {
		return value && !Array.isArray(value) ? format(parseISO(value), 'dd MMMM yyyy') : '';
	}

	submitVehicleForm(): void {
		if (!this.team) {
			throw 'no team context';
		}
		if (!this.vehicleType) {
			throw 'no vehicleType';
		}
		this.isSubmitting = true;
		const request: ICreateVehicleAssetRequest = {
			category: 'vehicle',
			teamID: this.team?.id,
			type: this.vehicleType,
			countryID: this.countryIso2,
			title: '',
			regNumber: this.regNumber,
		};
		if (this.yearOfBuild) {
			request.yearOfBuild = new Date(this.yearOfBuild).getFullYear();
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

		this.createAssetAndGoToAssetPage(request, this.team);
	}
}
