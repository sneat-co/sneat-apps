import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EngineType, FuelType } from '@sneat/dto';


@Component({
	selector: 'sneat-vehicle-engine',
	templateUrl: './vehicle-engine.component.html',

})
export class VehicleEngineComponent {
	readonly engineType = new FormControl<EngineType | undefined>(undefined);
	readonly fuelType = new FormControl<FuelType>('');
}
