//tslint:disable:no-unsafe-any
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AssetVehicleType, carMakes } from '@sneat/dto';
import { IAssetContext, ITeamContext, IVehicleAssetContext } from '@sneat/team/models';

// import {carMakes} from 'sneat-shared/models/data/vehicles';

@Component({
	selector: 'sneat-vehicle-card',
	templateUrl: './vehicle-card.component.html',
})
export class VehicleCardComponent implements OnChanges {

	@Input() team?: ITeamContext;
	@Input() asset?: IVehicleAssetContext;
	@Output() assetChange = new EventEmitter<IAssetContext>();

	get vehicleType(): AssetVehicleType | undefined {
		return this.asset?.dto?.type as AssetVehicleType;
	}

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
		if (changes['team'] && this.team?.dto?.countryID && this.asset?.dto && !this.asset.dto.countryID) {
			this.asset = { ...this.asset, dto: {...this.asset.dto, countryID: this.team.dto.countryID} };
			this.assetChange.emit(this.asset);
		}
	}


	// tslint:disable-next-line:prefer-function-over-method
	editRegNumber(): void {
		alert('Editing registration number is not implemented yet');
	}

	// tslint:disable-next-line:prefer-function-over-method
	editMakeModel(event?: Event): void {
		if (event) {
			event.stopPropagation();
		}
		alert('Editing make&model is not implemented yet');
	}

	countryChanged(value: string): void {
		if (this.asset?.dto) {
			this.asset = { ...this.asset, dto: { ...this.asset.dto, countryID: value } };
			this.assetChange.emit(this.asset);
		}
	}

	makeChanged(value: string): void {
		this.makeVal = value;
		if (this.asset?.dto) {
			this.asset = { ...this.asset, dto: { ...this.asset.dto, make: value } };
			this.assetChange.emit(this.asset);
		}
		this.populateModels();
	}

	modelChanged(value: string): void {
		if (this.asset?.dto) {
			this.asset = { ...this.asset, dto: { ...this.asset.dto, model: value } };
			this.assetChange.emit(this.asset);
		}
	}

	private populateModels(): void {
		if (!this.makeVal) {
			this.models = undefined;
			this.modelVal = undefined;
			return;
		}
		const make = carMakes[this.makeVal];
		this.models = make.models.map(v => v.model);
		if (this.modelVal && this.models.indexOf(this.modelVal) <= 0) {
			this.modelVal = undefined;
		}
	}
}
