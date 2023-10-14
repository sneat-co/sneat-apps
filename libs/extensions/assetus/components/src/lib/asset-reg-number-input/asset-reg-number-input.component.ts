import { CommonModule } from '@angular/common';
import {
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AssetService, IUpdateAssetRequest } from '../services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAssetContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-asset-reg-number',
	templateUrl: 'asset-reg-number-input.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class AssetRegNumberInputComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext;
	@Input({ required: true }) asset?: IAssetContext;
	@Input() placeholder = '';

	protected isSaving = false;
	protected readonly regNumber = new FormControl('');

	constructor(
		private readonly assetService: AssetService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['asset'] && !this.regNumber.dirty) {
			this.regNumber.setValue(this.asset?.brief?.regNumber || '');
		}
	}

	protected get showSave(): boolean {
		return (
			this.regNumber.dirty &&
			(this.asset?.brief?.regNumber || '') !== this.regNumber.value
		);
	}

	protected submit(): void {
		const team = this.team,
			asset = this.asset;

		if (!team?.id || !asset?.id || !asset) {
			return;
		}

		const request: IUpdateAssetRequest = {
			teamID: team.id,
			assetID: asset.id,
			assetCategory: 'vehicle',
			regNumber: this.regNumber.value || '',
		};
		this.isSaving = true;
		this.regNumber.disable();
		this.assetService.updateAsset(request).subscribe({
			next: () => {
				this.regNumber.markAsPristine();
				this.isSaving = false;
				this.regNumber.enable();
			},
			error: (e) => {
				setTimeout(() => {
					this.isSaving = false;
					this.regNumber.enable();
				}, 1000);
				this.errorLogger.logError(e, 'Failed to save registration number');
			},
		});
	}
}
