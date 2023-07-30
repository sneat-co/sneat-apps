//tslint:disable:no-unsafe-any
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { carMakes } from '@sneat/dto';
import { IAssetContext, ITeamContext, IVehicleAssetContext } from '@sneat/team/models';

// import {carMakes} from 'sneat-shared/models/data/vehicles';

@Component({
	selector: 'sneat-vehicle-card',
	templateUrl: './vehicle-card.component.html',
})
export class VehicleCardComponent implements OnChanges {

	@Input() team?: ITeamContext;
	@Input() vehicleAsset?: IVehicleAssetContext;
	@Output() readonly vehicleAssetChange = new EventEmitter<IVehicleAssetContext>();

	regNumber = '';
	makeVal?: string;
	modelVal?: string | undefined;

	makes?: string[];
	models: string[] | undefined;
	engine = '';
	yearBuildNumber?: number;
	yearBuildVal?: string;

	@Input() set make(v: string) {
		this.makeVal = v;
		this.makes = Object.keys(carMakes);
		this.populateModels();
	}

	@Input() set model(v: string) {
		this.modelVal = v;
	}

	@Input() set yearBuild(v: number) {
		this.yearBuildNumber = v;
		this.yearBuildVal = v.toString();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team'] && this.team?.dto?.countryID && this.vehicleAsset?.dto && !this.vehicleAsset.dto.countryID) {
			this.vehicleAsset = { ...this.vehicleAsset, dto: { ...this.vehicleAsset.dto, countryID: this.team.dto.countryID } };
			this.vehicleAssetChange.emit(this.vehicleAsset);
		}
	}


	// tslint:disable-next-line:prefer-function-over-method
	editRegNumber(): void {
		alert('Editing registration number is not implemented yet');
	}

	countryChanged(value: string): void {
		if (this.vehicleAsset?.dto) {
			this.vehicleAsset = { ...this.vehicleAsset, dto: { ...this.vehicleAsset.dto, countryID: value } };
			this.vehicleAssetChange.emit(this.vehicleAsset);
		}
	}

	makeChanged(value: string): void {
		this.makeVal = value;
		if (this.vehicleAsset?.dto) {
			this.vehicleAsset = { ...this.vehicleAsset, dto: { ...this.vehicleAsset.dto, make: value } };
			this.vehicleAssetChange.emit(this.vehicleAsset);
		}
		this.populateModels();
	}

	protected onAssetChanged(asset: IAssetContext): void {
		console.log('onVehicleAssetChanged', asset, this.vehicleAsset);
		this.vehicleAsset = asset as IVehicleAssetContext;
		this.vehicleAssetChange.emit(this.vehicleAsset);
	}

	modelChanged(value: string): void {
		if (this.vehicleAsset?.dto) {
			this.vehicleAsset = { ...this.vehicleAsset, dto: { ...this.vehicleAsset.dto, model: value } };
			this.vehicleAssetChange.emit(this.vehicleAsset);
		}
	}

	private populateModels(): void {
		if (!this.makeVal) {
			this.models = undefined;
			this.modelVal = undefined;
			return;
		}
		const make = carMakes[this.makeVal];
		this.models = make.models.map(v => v.id);
		if (this.modelVal && this.models.indexOf(this.modelVal) <= 0) {
			this.modelVal = undefined;
		}
	}
}
