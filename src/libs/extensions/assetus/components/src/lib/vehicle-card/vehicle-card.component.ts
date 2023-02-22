//tslint:disable:no-unsafe-any
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { carMakes, IVehicle } from '@sneat/dto';
import { IAssetContext } from '@sneat/team/models';

// import {carMakes} from 'sneat-shared/models/data/vehicles';

@Component({
	selector: 'sneat-vehicle-card',
	templateUrl: './vehicle-card.component.html',
})
export class VehicleCardComponent {

	@Input() asset?: IAssetContext;
	@Input() vehicle?: IVehicle;

	regNumber = '';
	makeVal?: string;
	modelVal?: string | undefined;

	makes?: string[];
	models: string[] | undefined;
	engine = '';
	yearBuildNumber?: number;
	yearBuildVal?: string;
	// tslint:disable-next-line:no-any
	@Output() changed = new EventEmitter<{ field: string; value: unknown }>();

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

	makeChanged(): void {
		this.changed.emit({ field: 'make', value: this.makeVal });
		this.populateModels();
	}

	modelChanged(): void {
		this.changed.emit({ field: 'model', value: this.makeVal });
	}

	yearChanged(): void {
		if (this.yearBuildVal) {
			this.yearBuildNumber = new Date(this.yearBuildVal).getFullYear();
			this.changed.emit({ field: 'yearBuild', value: this.yearBuildVal });
		} else {
			this.yearBuildNumber = undefined;
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
