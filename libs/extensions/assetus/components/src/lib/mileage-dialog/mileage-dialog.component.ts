import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IIdAndBrief } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IAssetBrief,
	CurrencyList,
	CurrencyCode,
	FuelVolumeUnitTypes,
	FuelVolumeUnit,
	MileageUnit,
	MileageUnitTypes,
} from '@sneat/mod-assetus-core';
import { AssetService, IAddVehicleRecordRequest } from '../services';
import { ISpaceBrief } from '@sneat/dto';

@Component({
	selector: 'sneat-mileage-dialog',
	templateUrl: './mileage-dialog.component.html',
	styleUrls: ['./mileage-dialog.component.scss'],
	standalone: false,
})
export class MileAgeDialogComponent {
	@Input() space?: IIdAndBrief<ISpaceBrief>;
	@Input() asset?: IIdAndBrief<IAssetBrief>;

	protected currencyList: CurrencyCode[] = CurrencyList;
	protected fuelVolumeUnitTypes = FuelVolumeUnitTypes;
	protected mileageUnitTypes = MileageUnitTypes;

	protected fuelVolume = new FormControl<number | undefined>(undefined);
	protected fuelVolumeUnit = new FormControl<FuelVolumeUnit | undefined>(
		undefined,
	);

	protected fuelCost = new FormControl<number | undefined>(undefined);
	protected currency = new FormControl<CurrencyCode | undefined>(undefined);

	protected mileage = new FormControl<number | undefined>(undefined);
	protected mileageUnit = new FormControl<MileageUnit | undefined>(undefined);

	protected addVehicleRecordForm = new FormGroup({
		fuelVolume: this.fuelVolume,
		fuelVolumeUnit: this.fuelVolumeUnit,

		fuelCost: this.fuelCost,
		currency: this.currency,

		mileage: this.mileage,
		mileageUnit: this.mileageUnit,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly assetService: AssetService,
		private readonly modalCtrl: ModalController,
	) {}

	// ionViewDidEnter() {
	// 	setTimeout(() => {
	// 		this.inputTitle
	// 			?.setFocus()
	// 			.catch((err) =>
	// 				this.errorLogger.logError(err, 'Failed to set focus to title input'),
	// 			);
	// 	}, 100);
	// }

	// selectCardType(cardType: 'sql' | 'http'): void {
	// 	this.modalCtrl
	// 		.dismiss({ cardType, title: this.cardTitle })
	// 		.catch(this.errorLogger.logErrorHandler('Failed to dismiss modal'));
	// }

	submit(): void {
		console.log('MileageDialog.submit', this.addVehicleRecordForm.value);

		if (!this.asset?.id) {
			throw new Error('assetId is not set');
		}
		if (!this.space?.id) {
			throw new Error('spaceId is not set');
		}

		if (
			(this.fuelVolume.value !== undefined) !==
			(this.fuelVolumeUnit.value !== undefined)
		) {
			throw new Error(
				'fuelVolume and fuelVolumeUnit should be both set or both unset',
			);
		}

		if (
			(this.fuelCost.value !== undefined) !==
			(this.currency.value !== undefined)
		) {
			throw new Error('fuelCost and currency should be both set or both unset');
		}

		if (
			(this.mileage.value !== undefined) !==
			(this.mileageUnit.value !== undefined)
		) {
			throw new Error(
				'mileage and mileageUnit should be both set or both unset',
			);
		}

		const request: IAddVehicleRecordRequest = {
			spaceID: this.space.id,
			assetID: this.asset.id,
			fuelVolume: this.fuelVolume.value || undefined,
			fuelVolumeUnit: this.fuelVolumeUnit.value || undefined,
			fuelCost: this.fuelCost.value || undefined,
			currency: this.currency.value || undefined,
			mileage: this.mileage.value || undefined,
			mileageUnit: this.mileageUnit.value || undefined,
		};

		this.assetService.addVehicleRecord(request).subscribe({
			next: (id) => {
				console.log('Vehicle record added:', id);
				this.modalCtrl
					.dismiss()
					.catch(
						this.errorLogger.logErrorHandler(
							'Failed to dismiss modal on success',
						),
					);
			},
			error: (err) => {
				console.error('Failed to add vehicle record:', err);
			},
		});

		// const request: ICreateDebtRecordRequest = {
		// 	teamID,
		// 	contactID,
		// 	amount: this.amount.value,
		// 	currency: this.currency.value,
		// };
		// this.debtusService.createDebtRecord(request).subscribe({
		// 	next: (id) => {
		// 		console.log('Debt record created:', id);
		// 	},
		// 	error: (err) => {
		// 		console.error('Failed to create debt record:', err);
		// 	},
		// });
	}

	cancel(): void {
		this.modalCtrl
			.dismiss()
			.catch(
				this.errorLogger.logErrorHandler('Failed to dismiss modal on cancel'),
			);
	}
}
