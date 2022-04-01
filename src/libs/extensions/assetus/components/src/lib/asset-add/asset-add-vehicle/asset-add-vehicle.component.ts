import { Component, Input } from '@angular/core';
import { carMakes, IMake, IModel, IVehicle, VehicleType } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ITeamContext } from '@sneat/team/models';
import { format, parseISO } from 'date-fns';
import { AssetAddBasePage } from '../asset-add-base-page';

@Component({
	selector: 'sneat-asset-add-vehicle',
	templateUrl: './asset-add-vehicle.component.html',
	providers: [TeamComponentBaseParams],
})
export class AssetAddVehicleComponent extends AssetAddBasePage {

	@Input() team?: ITeamContext;

	vehicleType: VehicleType = 'car';

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
	isSubmitting = false;

	constructor(
		// private readonly assetService: IAssetService,
	) {
		super();
		console.log('AssetAddVehicleComponent.constructor()');
		this.makes = Object.keys(carMakes).map(id => ({ id, title: id }));
	}

	readonly id = (i: number, v: { id: string }) => v.id;

	formatDate(value?: string | null): string {
		return value ? format(parseISO(value), 'dd MMMM yyyy') : '';
	}

	makeChanged(): void {
		const make = carMakes[this.make];
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
		this.isSubmitting = true;
		const title = `${this.make} ${this.model} ${this.engine}`;
		const assetDto: IVehicle = {
			type: 'vehicle',
			teamID: this.team?.id,
			categoryId: 'vehicles',
			vehicleType: this.vehicleType,
			title,
			number: this.regNumber,
		};
		if (this.make) {
			assetDto.make = this.make;
			if (this.model) {
				assetDto.model = this.model;
			}
		}
		if (this.yearOfBuild) {
			assetDto.yearOfBuild = new Date(this.yearOfBuild).getFullYear();
		}
		if (this.vin) {
			assetDto.vin = this.vin;
		}
		if (this.countryIso2) {
			assetDto.countryID = this.countryIso2;
		}
		if (this.taxExpires) {
			assetDto.taxExpires = this.taxExpires;
		}
		if (this.nctExpires) {
			assetDto.nctExpires = this.nctExpires;
		}
		if (this.nextServiceDue) {
			assetDto.nextServiceDue = this.nextServiceDue;
		}
		// tslint:disable-next-line:no-this-assignment
		const { engine } = this;
		if (engine) {
			const engineLower = engine.toLowerCase();
			assetDto.engine = engine;
			if (engineLower.indexOf('petrol') >= 0) {
				assetDto.fuelType = 'petrol';
			} else if (engineLower.indexOf('diesel') >= 0) {
				assetDto.fuelType = 'diesel';
			}
			const size = engine.match(/(\d+(\.\d)?)+L/);
			console.log('size:', size);
			if (size) {
				// tslint:disable-next-line:no-magic-numbers
				assetDto.engineCC = +size[1] * 1000;
			}
		}

		// this.assetService.add(assetDto)
		// 	.subscribe(
		// 		dto => {
		// 			this.navigateForward('asset', { id: dto.id }, { assetDto }, { excludeCommuneId: true, replaceUrl: true });
		// 		},
		// 		err => {
		// 			this.isSubmitting = false;
		// 			alert(err);
		// 		});
	}
}
