import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISelectItem } from '@sneat/components';
import { EngineType, EngineTypes, FuelType, FuelTypes } from '@sneat/dto';
import { IVehicleAssetContext } from '@sneat/team/models';


@Component({
	selector: 'sneat-vehicle-engine',
	templateUrl: './vehicle-engine.component.html',

})
export class VehicleEngineComponent {
	@Input() public vehicleAsset?: IVehicleAssetContext;
	@Output() public readonly vehicleAssetChange = new EventEmitter<IVehicleAssetContext>();

	readonly engineTypes: ISelectItem[] = [
		{ id: FuelTypes.petrol, title: 'Petrol', emoji: '🔥' },
		{ id: FuelTypes.diesel, title: 'Diesel', emoji: '🔥' },
		{ id: EngineTypes.electric, title: 'Electric', emoji: '🔌' },
		{ id: 'phev_petrol', title: 'PHEV Petrol', emoji: '🔌🔥' },
		{ id: 'phev_diesel', title: 'PHEV Diesel', emoji: '🔌🔥' },
		{ id: 'hybrid_petrol', title: 'Hybrid Petrol', emoji: '🔋🔥' },
		{ id: 'hybrid_diesel', title: 'Hybrid Diesel', emoji: '🔋🔥' },
		{ id: FuelTypes.hydrogen, title: 'Hydrogen', emoji: '💧' },
		{ id: EngineTypes.steam, title: 'Steam', emoji: '🚂' },
		{ id: EngineTypes.other, title: 'Other', labelColor: 'medium' },
		{ id: '', title: 'Unknown', labelColor: 'medium' },
	];

	protected onEngineTypeChanged(v: string): void {
		let engineType: EngineType = EngineTypes.unknown;
		let fuelType: FuelType = FuelTypes.unknown;
		if (this.vehicleAsset?.dto) {
			switch (v) {
				case FuelTypes.diesel:
					engineType = EngineTypes.combustion;
					fuelType = FuelTypes.diesel;
					break;
				case FuelTypes.petrol:
					engineType = EngineTypes.combustion;
					fuelType = FuelTypes.petrol;
					break;
				case 'phev_diesel':
					engineType = EngineTypes.phev;
					fuelType = FuelTypes.diesel;
					break;
				case 'phev_petrol':
					engineType = EngineTypes.phev;
					fuelType = FuelTypes.petrol;
					break;
				case 'hybrid_diesel':
					engineType = EngineTypes.hybrid;
					fuelType = FuelTypes.diesel;
					break;
				case 'hybrid_petrol':
					engineType = EngineTypes.hybrid;
					fuelType = FuelTypes.petrol;
					break;
				case EngineTypes.steam:
					engineType = EngineTypes.steam;
					fuelType = FuelTypes.unknown;
					break;
				case 'other':
					engineType = EngineTypes.other;
					fuelType = FuelTypes.other;
					break;
			}
			this.vehicleAsset = {
				...this.vehicleAsset,
				dto: { ...this.vehicleAsset.dto, engineType, fuelType },
			};
			this.vehicleAssetChange.emit(this.vehicleAsset);
		}
	}
}
