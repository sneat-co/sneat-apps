import { Component, Input } from '@angular/core';
import { ISelectItem } from '@sneat/components';
import { carMakes, IMake, IModel, IVehicle, VehicleType } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ITeamContext } from '@sneat/team/models';
import { format, parseISO } from 'date-fns';
import { AssetService } from '../../asset-service';
import { ICreateAssetRequest } from '../../asset-service.dto';
import { AddAssetBaseComponent } from '../add-asset-base-component';

@Component({
	selector: 'sneat-asset-add-vehicle',
	templateUrl: './asset-add-vehicle.component.html',
	providers: [TeamComponentBaseParams],
})
export class AssetAddVehicleComponent extends AddAssetBaseComponent {

	@Input() team?: ITeamContext;

	vehicleType?: VehicleType;
	vehicleTypes: ISelectItem[] = [
		{ id: 'car', title: 'Car', iconName: 'car-outline' },
		{ id: 'motorbike', title: 'Motorbike', iconName: 'bicycle-outline' },
		{ id: 'bicycle', title: 'Bicycle', iconName: 'bicycle-outline' },
		{ id: 'boat', title: 'Boat', iconName: 'boat-outline' },
	];

	public countryIso2 = 'IE';
	public regNumber = '';
	public vin = '';
	public yearOfBuild = '';
	public makes: IMake[] = [{ id: 'audi', title: 'Audi' }, { id: 'bmw', title: 'BMW' }];
	public make = '';
	public model = '';
	public engine = '';
	public models: IModel[] = [{ id: 'A4', title: 'A4' }, { id: 'A6', title: 'A6' }];
	public engines?: string[];

	public nctExpires = '';       // ISO date string 'YYYY-MM-DD'
	public taxExpires = '';      // ISO date string 'YYYY-MM-DD'
	public nextServiceDue = '';  // ISO date string 'YYYY-MM-DD'

	constructor(
		teamParams: TeamComponentBaseParams,
		assetService: AssetService,
	) {
		super(teamParams, assetService);
		this.makes = Object.keys(carMakes).map(id => ({ id, title: id }));
	}


	onVehicleTypeChanged(): void {
		this.make = '';
		this.model = '';
	}

	readonly id = (i: number, v: { id: string }) => v.id;

	formatDate(value?: string | null): string {
		return value ? format(parseISO(value), 'dd MMMM yyyy') : '';
	}

	makeChanged(event: Event): void {
		console.log('makeChanged', event, this.make);
		const make = carMakes[this.make];
		if (!make) {
			console.log('make not found by id: ' + this.make)
			this.models = [];
			return;
		}
		this.models = make.models.map(v => ({ id: v.model, title: v.model }));
	}

	modelChanged(): void {
		const make = carMakes[this.make];
		const model = make.models.find(v => v.model === this.model);
		if (!model) {
			throw new Error('model not found');
		}
		this.engines = model.engines.map(e => e.title);
	}

	submitVehicleForm(): void {
		if (!this.team) {
			throw 'no team context';
		}
		if (!this.vehicleType) {
			throw 'no vehicleType';
		}
		if (!this.make) {
			throw 'no make';
		}
		if (!this.model) {
			throw 'no model';
		}
		this.isSubmitting = true;
		const title = `${this.make} ${this.model} ${this.engine}`;
		const vehicle: IVehicle = {
			make: this.make,
			model: this.model,
		};
		const request: ICreateAssetRequest = {
			type: 'vehicle',
			teamID: this.team?.id,
			subType: this.vehicleType,
			countryID: this.countryIso2,
			title,
			regNumber: this.regNumber,
			vehicle,
		};
		if (this.yearOfBuild) {
			request.yearOfBuild = new Date(this.yearOfBuild).getFullYear();
		}
		if (this.vin) {
			vehicle.vin = this.vin;
		}
		if (this.countryIso2) {
			request.countryID = this.countryIso2;
		}
		if (this.taxExpires) {
			vehicle.taxExpires = this.taxExpires;
		}
		if (this.nctExpires) {
			vehicle.nctExpires = this.nctExpires;
		}
		if (this.nextServiceDue) {
			vehicle.nextServiceDue = this.nextServiceDue;
		}
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
