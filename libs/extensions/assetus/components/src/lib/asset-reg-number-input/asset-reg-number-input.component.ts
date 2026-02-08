import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
	inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { AssetService, IUpdateAssetRequest } from '../services';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-asset-reg-number',
	templateUrl: 'asset-reg-number-input.component.html',
	imports: [
		ReactiveFormsModule,
		IonItem,
		IonInput,
		IonButtons,
		IonButton,
		IonLabel,
		IonIcon,
	],
})
export class AssetRegNumberInputComponent implements OnChanges {
	private readonly assetService = inject(AssetService);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

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
		const space = this.space;

		if (!space?.id || !this.assetID) {
			return;
		}

		const request: IUpdateAssetRequest = {
			spaceID: space.id,
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
