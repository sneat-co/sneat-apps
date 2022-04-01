import {Component} from '@angular/core';
import {AssetAddBasePage} from '../asset-add-base-page';
import {IVehicle} from 'sneat-shared/models/dto/dto-asset';
import {carMakes} from 'sneat-shared/models/data/vehicles';
import {VehicleType} from 'sneat-shared/models/types';
import {IAssetService} from 'sneat-shared/services/interfaces';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {IRecord, RxRecordKey} from 'rxstore';


@Component({
	selector: 'sneat-asset-add-vehicle',
	templateUrl: './asset-add-vehicle-page.component.html',
	providers: [CommuneBasePageParams],
})
export class AssetAddVehiclePageComponent extends AssetAddBasePage {

	vehicleType: VehicleType = 'car';

	public countryIso2 = 'IE';
	public regNumber: string;
	public vin: string;
	public yearBuild: string;
	public makes: string[];
	public make: string;
	public model: string;
	public engine: string;
	public models: string[];
	public engines: string[];

	public nctExpires: string;       // ISO date string 'YYYY-MM-DD'
	public taxExpires?: string;      // ISO date string 'YYYY-MM-DD'
	public nextServiceDue?: string;  // ISO date string 'YYYY-MM-DD'
	isSubmitting: boolean;

	constructor(
		private readonly assetService: IAssetService,
		params: CommuneBasePageParams,
	) {
		super('assets', params);
		this.makes = Object.keys(carMakes);
	}

	makeChanged(): void {
		const make = carMakes[this.make];
		this.models = make.models.map(v => v.model);
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
		this.isSubmitting = true;
		const title = `${this.make} ${this.model} ${this.engine}`;
		const assetDto: IVehicle = {
			communeId: this.communeRealId,
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
		if (this.yearBuild) {
			assetDto.yearBuild = new Date(this.yearBuild).getFullYear();
		}
		if (this.vin) {
			assetDto.vin = this.vin;
		}
		if (this.countryIso2) {
			assetDto.countryId = this.countryIso2;
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
		const {engine} = this;
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

		this.assetService.add(assetDto)
			.subscribe(
				dto => {
					this.navigateForward('asset', {id: dto.id}, {assetDto}, {excludeCommuneId: true, replaceUrl: true});
				},
				err => {
					this.isSubmitting = false;
					alert(err);
				});
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}
}
