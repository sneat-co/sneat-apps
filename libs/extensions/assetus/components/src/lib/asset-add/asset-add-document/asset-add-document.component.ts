import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonDatetime,
	IonIcon,
	IonInput,
	IonItem,
	IonPopover,
} from '@ionic/angular/standalone';
import { ClassName, ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { timestamp } from '@sneat/dto';
import {
	AssetPossession,
	AssetVehicleType,
	IAssetContext,
	IAssetDocumentContext,
	IAssetDocumentExtra,
} from '@sneat/mod-assetus-core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { format, parseISO } from 'date-fns';
import { ICreateAssetRequest } from '../../services';
import { AddAssetBaseComponent } from '../add-asset-base-component';

@Component({
	selector: 'sneat-asset-add-document',
	templateUrl: './asset-add-document.component.html',
	providers: [
		{
			provide: ClassName,
			useValue: 'AssetAddVehicleComponent',
		},
		SpaceComponentBaseParams,
	],
	imports: [
		IonCard,
		SelectFromListComponent,
		FormsModule,
		IonItem,
		IonInput,
		IonButtons,
		IonButton,
		IonIcon,
		IonPopover,
		IonDatetime,
	],
})
export class AssetAddDocumentComponent
	extends AddAssetBaseComponent
	implements OnChanges
{
	// @Input() public override space?: ISpaceContext;
	@Input() public documentAsset?: IAssetDocumentContext;

	protected documentType?: AssetVehicleType;
	protected readonly documentTypes: ISelectItem[] = [
		{ id: 'car', title: 'Car', iconName: 'car-outline' },
		{ id: 'motorbike', title: 'Motorbike', iconName: 'bicycle-outline' },
		// { id: 'bicycle', title: 'Bicycle', iconName: 'bicycle-outline' }, this is a sport asset
		{ id: 'boat', title: 'Boat', iconName: 'boat-outline' },
	];

	protected countryIso2 = 'IE';
	protected regNumber = '';
	protected vin = '';
	protected yearOfBuild = '';
	// public make = '';
	// public model = '';
	protected engine = '';
	protected engines?: string[];

	protected nctExpires = ''; // ISO date string 'YYYY-MM-DD'
	protected taxExpires = ''; // ISO date string 'YYYY-MM-DD'
	protected nextServiceDue = ''; // ISO date string 'YYYY-MM-DD'

	ngOnChanges(changes: SimpleChanges): void {
		const spaceChanges = changes['space'];
		if (spaceChanges && this.space) {
			const a: IAssetContext<'document'> = this.documentAsset ?? {
				id: '',
				space: this.space ?? { id: '' },
				dbo: {
					status: 'draft',
					category: 'vehicle',
					extraType: 'document',
					extra: {},
					spaceID: this.space?.id,
					type: this.documentType,
					title: '',
					possession: undefined as unknown as AssetPossession,
					createdAt: new Date().toISOString() as unknown as timestamp,
					createdBy: '-',
					updatedAt: new Date().toISOString() as unknown as timestamp,
					updatedBy: '-',
				},
			};
			this.documentAsset = { ...a, space: this.space };
		}
	}

	constructor() {
		// super('AssetAddVehicleComponent', route, teamParams, assetService);
		super();
	}

	protected onAssetChanged(asset: IAssetContext): void {
		console.log('onAssetChanged', asset, this.documentAsset);
	}

	protected onVehicleTypeChanged(): void {
		if (this.documentAsset?.dbo) {
			this.documentAsset = {
				...this.documentAsset,
				dbo: {
					...this.documentAsset.dbo,
					type: this.documentType,
					extraType: 'document',
					extra: {},
				},
			};
		}
	}

	protected formatDate(value?: string | string[] | null): string {
		return value && !Array.isArray(value)
			? format(parseISO(value), 'dd MMMM yyyy')
			: '';
	}

	protected submitDocumentForm(): void {
		console.log('submitDocumentForm', this.documentAsset);
		if (!this.space) {
			throw 'no team context';
		}
		if (!this.documentType) {
			throw 'no vehicleType';
		}
		const assetDto = this.documentAsset?.dbo;
		if (!assetDto) {
			throw new Error('no asset');
		}
		this.isSubmitting = true;
		let request: ICreateAssetRequest<'document', IAssetDocumentExtra> = {
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
