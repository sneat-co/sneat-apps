import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IAssetDtoBase, IVehicleAssetDto } from '@sneat/mod-assetus-core';

interface AssetDate {
	name: string;
	title: string;
	value?: string;
}

@Component({
	selector: 'sneat-asset-dates',
	templateUrl: './asset-dates.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class AssetDatesComponent {
	private assetDto?: IAssetDtoBase;

	@Input() set asset(v: IAssetDtoBase) {
		console.log('AssetDatesComponent => asset:', v);
		this.assetDto = v;
		switch (v.category) {
			case 'vehicle': {
				const vehicle = v as IVehicleAssetDto;
				this.items = [
					{
						name: 'nctExpires',
						title: 'NCT expires',
						value: vehicle.nctExpires,
					},
					{
						name: 'taxExpires',
						title: 'Tax expires',
						value: vehicle.taxExpires,
					},
					{
						name: 'nextServiceDue',
						title: 'Next service due',
						value: vehicle.nextServiceDue,
					},
				];
				break;
			}
			case 'dwelling': {
				// const property = v as IDwelling;
				this.items = [
					{
						name: 'leaseExpires',
						title: 'Lease expires',
						value: 'property.leaseExpires',
					},
				];
				break;
			}
			default:
				this.items = [];
				break;
		}
	}

	@Output() changed = new EventEmitter<{ name: string; value: string }>();

	// constructor(private readonly businessLogic: IBusinessLogic) {}

	protected items?: AssetDate[];

	trackByName(i: number, v: AssetDate): string {
		return v.name;
	}

	onChange(name: string, $event: CustomEvent): void {
		console.log(`AssetDatesComponent.onChange ${name}: `, $event);
		const value = $event.detail.value;
		this.changed.emit({ name, value });
		let title: string;
		switch (name) {
			case 'nctExpires':
				title = 'NCT expires';
				break;
			case 'taxExpires':
				title = 'Tax expires';
				break;
			case 'nextServiceDue':
				title = 'Next service due';
				break;
			default:
				title = name;
				break;
		}
		throw new Error('not implemented yet, title=' + title);
		// if (this.assetDto.id) {
		// 	this.businessLogic
		// 		.changeAssetDate(this.assetDto.id, name, value, title)
		// 		.subscribe((assetDto) => {
		// 			this.assetDto = assetDto;
		// 		});
		// }
	}
}
