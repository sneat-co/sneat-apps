import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ISelectItem, SelectFromListModule } from '@sneat/components';
import {
	EngineType,
	EngineTypeCombustion,
	EngineTypeElectric,
	EngineTypeHybrid,
	EngineTypePHEV,
	EngineTypes,
	FuelType,
	FuelTypes,
	IVehicleAssetContext,
} from '@sneat/mod-assetus-core';

@Component({
	selector: 'sneat-vehicle-engine',
	templateUrl: './vehicle-engine.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, SelectFromListModule],
})
export class VehicleEngineComponent {
	@Input() public vehicleAsset?: IVehicleAssetContext;
	@Output() public readonly vehicleAssetChange =
		new EventEmitter<IVehicleAssetContext>();

	protected get hasBattery(): boolean {
		const et = this.vehicleAsset?.dto?.engineType;
		return (
			et === EngineTypeElectric ||
			et === EngineTypePHEV ||
			et === EngineTypeHybrid
		);
	}

	protected get hasCombustion(): boolean {
		const et = this.vehicleAsset?.dto?.engineType;
		return (
			et === EngineTypeCombustion ||
			et === EngineTypePHEV ||
			et === EngineTypeHybrid
		);
	}

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
		let engineFuel: FuelType = FuelTypes.unknown;
		if (this.vehicleAsset?.dto) {
			switch (v) {
				case FuelTypes.diesel:
					engineType = EngineTypes.combustion;
					engineFuel = FuelTypes.diesel;
					break;
				case FuelTypes.petrol:
					engineType = EngineTypes.combustion;
					engineFuel = FuelTypes.petrol;
					break;
				case 'phev_diesel':
					engineType = EngineTypes.phev;
					engineFuel = FuelTypes.diesel;
					break;
				case 'phev_petrol':
					engineType = EngineTypes.phev;
					engineFuel = FuelTypes.petrol;
					break;
				case 'hybrid_diesel':
					engineType = EngineTypes.hybrid;
					engineFuel = FuelTypes.diesel;
					break;
				case 'hybrid_petrol':
					engineType = EngineTypes.hybrid;
					engineFuel = FuelTypes.petrol;
					break;
				case EngineTypes.steam:
					engineType = EngineTypes.steam;
					engineFuel = FuelTypes.unknown;
					break;
				case 'other':
					engineType = EngineTypes.other;
					engineFuel = FuelTypes.other;
					break;
			}
			this.vehicleAsset = {
				...this.vehicleAsset,
				dto: { ...this.vehicleAsset.dto, engineType, engineFuel },
			};
			this.vehicleAssetChange.emit(this.vehicleAsset);
		}
	}
}
