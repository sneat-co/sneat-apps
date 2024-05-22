import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AssetService, IUpdateAssetRequest } from '../services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
import { IAssetContext } from '@sneat/mod-assetus-core';

@Component({
	selector: 'sneat-asset-reg-number',
	templateUrl: 'asset-reg-number-input.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class AssetRegNumberInputComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext;
	@Input({ required: true }) assetID?: string;
	@Input({ required: true }) countyID?: string;
	@Input({ required: true }) regNumber?: string = '';
	@Input() hideSaveButton = false;
	@Input() placeholder = '';

	@Output() regNumberChange = new EventEmitter<string>();

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

	protected validate(): void {
		console.log('validate');
	}

	protected submit(): void {
		const team = this.team;

		if (!team?.id || !this.assetID) {
			return;
		}

		const request: IUpdateAssetRequest = {
			teamID: team.id,
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
}
