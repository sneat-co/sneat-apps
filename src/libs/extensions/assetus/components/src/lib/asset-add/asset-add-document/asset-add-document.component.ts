import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import {
	AssetPossession,
	AssetVehicleType,
	IDocumentAssetDto, IDocumentMainData,
	timestamp,
} from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IDocumentAssetContext, ITeamContext, IVehicleAssetContext } from '@sneat/team/models';
import { format, parseISO } from 'date-fns';
import { AssetService } from '../../services/asset-service';
import { ICreateAssetRequest } from '../../asset-service.dto';
import { AddAssetBaseComponent } from '../add-asset-base-component';

@Component({
	selector: 'sneat-asset-add-document',
	templateUrl: './asset-add-document.component.html',
	providers: [TeamComponentBaseParams],
})
export class AssetAddDocumentComponent extends AddAssetBaseComponent implements OnChanges {

	@Input() public override team?: ITeamContext;
	@Input() public documentAsset?: IDocumentAssetContext;

	documentType?: AssetVehicleType;
	documentTypes: ISelectItem[] = [
		{ id: 'car', title: 'Car', iconName: 'car-outline' },
		{ id: 'motorbike', title: 'Motorbike', iconName: 'bicycle-outline' },
		// { id: 'bicycle', title: 'Bicycle', iconName: 'bicycle-outline' }, this is a sport asset
		{ id: 'boat', title: 'Boat', iconName: 'boat-outline' },
	];


	public countryIso2 = 'IE';
	public regNumber = '';
	public vin = '';
	public yearOfBuild = '';
	// public make = '';
	// public model = '';
	public engine = '';
	public engines?: string[];

	public nctExpires = '';       // ISO date string 'YYYY-MM-DD'
	public taxExpires = '';      // ISO date string 'YYYY-MM-DD'
	public nextServiceDue = '';  // ISO date string 'YYYY-MM-DD'

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team'] && this.team) {
			const a: IDocumentAssetContext = this.documentAsset
				?? {
					id: '',
					team: this.team ?? { id: '' },
					dto: {
						status: 'draft',
						category: 'vehicle',
						teamID: this.team?.id,
						type: this.documentType,
						title: '',
						make: '',
						model: '',
						possession: undefined as unknown as AssetPossession,
						createdAt: new Date().toISOString() as unknown as timestamp,
						createdBy: '-',
						updatedAt: new Date().toISOString() as unknown as timestamp,
						updatedBy: '-',
					},
				};
			this.documentAsset = { ...a, team: this.team };
		}
	}

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		assetService: AssetService,
	) {
		// super('AssetAddVehicleComponent', route, teamParams, assetService);
		super('AssetAddVehicleComponent', route, teamParams, assetService);
	}

	protected onAssetChanged(asset: IVehicleAssetContext): void {
		console.log('onAssetChanged', asset, this.documentAsset);
	}

	onVehicleTypeChanged(): void {
		if (this.documentAsset?.dto) {
			this.documentAsset = {
				...this.documentAsset, dto: {
					...this.documentAsset.dto,
					type: this.documentType,
					make: '',
					model: '',
				},
			};
		}
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	formatDate(value?: string | string[] | null): string {
		return value && !Array.isArray(value) ? format(parseISO(value), 'dd MMMM yyyy') : '';
	}

	submitVehicleForm(): void {
		console.log('submitVehicleForm', this.documentAsset);
		if (!this.team) {
			throw 'no team context';
		}
		if (!this.documentType) {
			throw 'no vehicleType';
		}
		const assetDto = this.documentAsset?.dto;
		if (!assetDto) {
			throw new Error('no asset');
		}
		this.isSubmitting = true;
		let request: ICreateAssetRequest<IDocumentMainData> = {
			asset: {
				...assetDto,
				status: 'active',
				category: 'vehicle',
			},
			teamID: this.team?.id,
		};
		if (this.yearOfBuild) {
			request = { ...request, asset: { ...request.asset, yearOfBuild: +this.yearOfBuild } };
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

		// tslint:disable-next-line:no-this-assignment
		// const { engine } = this;
		// if (engine) {
		// 	const engineLower = engine.toLowerCase();
		// 	request.engine = engine;
		// 	if (engineLower.indexOf('petrol') >= 0) {
		// 		request.fuelType = 'petrol';
		// 	} else if (engineLower.indexOf('diesel') >= 0) {
		// 		request.fuelType = 'diesel';
		// 	}
		// 	const size = engine.match(/(\d+(\.\d)?)+L/);
		// 	console.log('size:', size);
		// 	if (size) {
		// 		// tslint:disable-next-line:no-magic-numbers
		// 		request.engineCC = +size[1] * 1000;
		// 	}
		// }

		this.createAssetAndGoToAssetPage<IDocumentMainData, IDocumentAssetDto>(request, this.team);
	}
}
