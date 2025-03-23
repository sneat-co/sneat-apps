import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard } from '@ionic/angular/standalone';
import { ISelectItem, SelectFromListComponent } from '@sneat/components';
import { timestamp } from '@sneat/dto';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import {
	AssetVehicleType,
	EngineTypes,
	FuelTypes,
	IAssetContext,
	IAssetVehicleContext,
	IAssetVehicleExtra,
} from '@sneat/mod-assetus-core';
import { format, parseISO } from 'date-fns';
import { ICreateAssetRequest } from '../../services';
import { VehicleCardComponent } from '../../vehicle-card/vehicle-card.component';
import { AddAssetBaseComponent } from '../add-asset-base-component';

@Component({
	selector: 'sneat-asset-add-vehicle',
	templateUrl: './asset-add-vehicle.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		SelectFromListComponent,
		FormsModule,
		IonCard,
		VehicleCardComponent,
		IonButton,
	],
})
export class AssetAddVehicleComponent
	extends AddAssetBaseComponent
	implements OnChanges
{
	@Input() public vehicleAsset?: IAssetVehicleContext;

	protected vehicleType?: AssetVehicleType;
	protected readonly vehicleTypes: ISelectItem[] = [
		{ id: 'car', title: 'Car', iconName: 'car-outline' },
		{ id: 'motorbike', title: 'Motorbike', iconName: 'bicycle-outline' },
		// { id: 'bicycle', title: 'Bicycle', iconName: 'bicycle-outline' }, this is a sport asset
		{ id: 'boat', title: 'Boat', iconName: 'boat-outline' },
	];

	protected countryIso2 = 'IE';
	protected regNumber = '';
	protected vin = '';
	protected yearOfBuild = '';
	// protected make = '';
	// protected model = '';
	protected engine = '';
	protected engines?: string[];

	protected nctExpires = ''; // ISO date string 'YYYY-MM-DD'
	protected taxExpires = ''; // ISO date string 'YYYY-MM-DD'
	protected nextServiceDue = ''; // ISO date string 'YYYY-MM-DD'

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['space'] && this.space) {
			const a: IAssetVehicleContext = this.vehicleAsset ?? {
				id: '',
				space: this.space ?? { id: '' },
				dbo: {
					status: 'draft',
					category: 'vehicle',
					extraType: 'vehicle',
					extra: {
						make: '',
						model: '',
						engineFuel: FuelTypes.unknown,
						engineType: EngineTypes.unknown,
					},
					spaceID: this.space?.id,
					type: this.vehicleType,
					possession: 'owning',
					createdAt: new Date().toISOString() as unknown as timestamp,
					createdBy: '-',
					updatedAt: new Date().toISOString() as unknown as timestamp,
					updatedBy: '-',
				},
			};
			this.vehicleAsset = { ...a, space: this.space };
		}
	}

	constructor() {
		// super('AssetAddVehicleComponent', route, teamParams, assetService);
		super('AssetAddVehicleComponent');
	}

	protected onAssetChanged(asset: IAssetContext): void {
		this.vehicleAsset = asset as IAssetVehicleContext;
	}

	onVehicleTypeChanged(): void {
		if (this.vehicleAsset?.dbo) {
			this.vehicleAsset = {
				...this.vehicleAsset,
				dbo: {
					...this.vehicleAsset.dbo,
					type: this.vehicleType,
					extraType: 'vehicle',
					extra: {
						make: '',
						model: '',
						regNumber: '',
						engineType: '',
						engineFuel: '',
					},
				},
			};
		}
	}

	formatDate(value?: string | string[] | null): string {
		return value && !Array.isArray(value)
			? format(parseISO(value), 'dd MMMM yyyy')
			: '';
	}

	protected submitVehicleForm(): void {
		console.log('submitVehicleForm', this.vehicleAsset);
		if (!this.space) {
			throw 'no team context';
		}
		if (!this.vehicleType) {
			throw 'no vehicleType';
		}
		const assetDto = this.vehicleAsset?.dbo;
		if (!assetDto) {
			throw new Error('no asset');
		}
		this.isSubmitting = true;
		let request: ICreateAssetRequest<'vehicle', IAssetVehicleExtra> = {
			asset: {
				...assetDto,
				status: 'active',
				category: 'vehicle',
			},
			spaceID: this.space?.id,
		};
		if (this.yearOfBuild) {
			request = {
				...request,
				asset: { ...request.asset, yearOfBuild: +this.yearOfBuild },
			};
		}

		// if (this.vin) {
		// 	vehicle.vin = this.vin;
		// }
		// if (this.countryIso2) {
		// 	request.countryID = this.countryIso2;
		// }
		// if (this.taxExpires) {
		// 	vehicle.taxExpires = this.taxExpires;
		// }
		// if (this.nctExpires) {
		// 	vehicle.nctExpires = this.nctExpires;
		// }
		// if (this.nextServiceDue) {
		// 	vehicle.nextServiceDue = this.nextServiceDue;
		// }

		// const { engine } = this;
		// if (engine) {
		// 	const engineLower = engine.toLowerCase();
		// 	request.engine = engine;
		// 	if (engineLower.includes('petrol')) {
		// 		request.fuelType = 'petrol';
		// 	} else if (engineLower.includes('diesel')) {
		// 		request.fuelType = 'diesel';
		// 	}
		// 	const size = engine.match(/(\d+(\.\d)?)+L/);
		// 	console.log('size:', size);
		// 	if (size) {
		// 		// tslint:disable-next-line:no-magic-numbers
		// 		request.engineCC = +size[1] * 1000;
		// 	}
		// }

		this.createAssetAndGoToAssetPage(request, this.space);
	}
}
