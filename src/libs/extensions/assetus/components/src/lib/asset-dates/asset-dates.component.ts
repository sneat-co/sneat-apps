//tslint:disable:no-unsafe-any
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IAssetDto, IVehicle} from 'sneat-shared/models/dto/dto-asset';
import {IRealEstate} from 'sneat-shared/models/dto/dto-models';
import {IBusinessLogic} from 'sneat-shared/services/interfaces';

interface AssetDate {
	name: string;
	title: string;
	value?: string;
}

@Component({
	selector: 'app-asset-dates',
	templateUrl: './asset-dates.component.html',
})
export class AssetDatesComponent {

	private assetDto: IAssetDto;

	@Input() set asset(v: IAssetDto) {
		console.log('AssetDatesComponent => asset:', v);
		this.assetDto = v;
		switch (v.categoryId) {
			case 'vehicles':
				const vehicle = v as IVehicle;
				this.items = [
					{name: 'nctExpires', title: 'NCT expires', value: vehicle.nctExpires},
					{name: 'taxExpires', title: 'Tax expires', value: vehicle.taxExpires},
					{name: 'nextServiceDue', title: 'Next service due', value: vehicle.nextServiceDue},
				];
				break;
			case 'real_estate':
				const property = v as IRealEstate;
				this.items = [
					{name: 'leaseExpires', title: 'Lease expires', value: property.leaseExpires},
				];
				break;
			default:
				this.items = [];
				break;
		}
	}

	@Output() changed = new EventEmitter<{ name: string; value: string }>();

	constructor(
		private readonly businessLogic: IBusinessLogic,
	) {
	}

	items: AssetDate[];

	// tslint:disable-next-line:prefer-function-over-method
	trackByName(i: number, v: AssetDate): string {
		return v.name;
	}

	onChange(name: string, $event: CustomEvent): void {
		console.log(`AssetDatesComponent.onChange ${name}: `, $event);
		const value = $event.detail.value;
		this.changed.emit({name, value});
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
		if (this.assetDto.id) {
			this.businessLogic.changeAssetDate(this.assetDto.id, name, value, title)
				.subscribe(assetDto => {
					this.assetDto = assetDto;
				});
		}
	}
}
