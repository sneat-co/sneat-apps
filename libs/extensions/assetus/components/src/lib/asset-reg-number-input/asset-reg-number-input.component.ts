import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonInput } from '@ionic/angular';
import { AssetService, IUpdateAssetRequest } from '../services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-asset-reg-number',
	templateUrl: 'asset-reg-number-input.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class AssetRegNumberInputComponent implements OnChanges {
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) assetID?: string;
	@Input({ required: true }) countyID?: string;
	@Input({ required: true }) regNumber?: string = '';
	@Input() hideSaveButton = false;
	@Input() placeholder = '';

	@Output() regNumberChange = new EventEmitter<string>();

	@Input() isSkipped = false;
	@Output() isSkippedChange = new EventEmitter<boolean>();

	@ViewChild(IonInput, { static: true }) regNumberInput!: IonInput;

	protected validatedRegNumber?: string;

	protected isSaving = false;
	protected readonly regNumberControl = new FormControl('');

	constructor(
		private readonly assetService: AssetService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['regNumber'] && !this.regNumberControl.dirty) {
			this.regNumberControl.setValue(this.regNumber || '');
		}
	}

	protected get showSave(): boolean {
		return (
			!this.hideSaveButton &&
			this.regNumberControl.dirty &&
			(this.regNumber || '') !== this.regNumberControl.value
		);
	}

	protected get isValidated(): boolean {
		return this.validatedRegNumber === this.regNumberControl.value?.trim();
	}
	protected validate(): void {
		console.log('validate');
		this.validatedRegNumber = this.regNumberControl.value?.trim();
		this.skipOrNext();
	}

	protected skipOrNext(): void {
		console.log('skipOrNext');
		const regNumber = this.regNumberControl.value?.trim();
		if (regNumber) {
			this.regNumberChange.emit(regNumber);
		}
		this.isSkippedChange.emit();
	}

	protected submit(): void {
		const team = this.space;

		if (!team?.id || !this.assetID) {
			return;
		}

		const request: IUpdateAssetRequest = {
			spaceID: team.id,
			assetID: this.assetID,
			assetCategory: 'vehicle',
			regNumber: this.regNumberControl.value || '',
		};
		this.isSaving = true;
		this.regNumberControl.disable();
		this.assetService.updateAsset(request).subscribe({
			next: () => {
				this.regNumberControl.markAsPristine();
				this.isSaving = false;
				this.regNumberControl.enable();
			},
			error: (e) => {
				setTimeout(() => {
					this.isSaving = false;
					this.regNumberControl.enable();
				}, 1000);
				this.errorLogger.logError(e, 'Failed to save registration number');
			},
		});
	}

	public focusToRegNumberInput(): void {
		this.regNumberInput
			.setFocus()
			.catch((e) => console.error('Failed to focus to reg number input', e));
	}
}
