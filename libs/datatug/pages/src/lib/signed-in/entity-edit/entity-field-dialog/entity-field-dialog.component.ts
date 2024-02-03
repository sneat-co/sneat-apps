import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { DataType, IEntityFieldDef } from '@sneat/datatug-models';

@Component({
	selector: 'sneat-datatug-entity-field-dialog',
	templateUrl: './entity-field-dialog.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, FormsModule],
})
export class EntityFieldDialogComponent {
	protected fieldId = '';
	protected fieldType?: DataType;
	protected regexPattern?: string;

	constructor(
		private readonly popoverCtrl: PopoverController,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	complete(): void {
		if (!this.fieldType) {
			return;
		}
		let data: IEntityFieldDef = { id: this.fieldId, type: this.fieldType };
		if (this.regexPattern) {
			data = { ...data, namePattern: { regexp: this.regexPattern } };
		}
		this.popoverCtrl
			.dismiss(data, 'save')
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to dismiss popover'),
			);
	}

	cancel(): void {
		this.popoverCtrl
			.dismiss(undefined, 'cancel')
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to dismiss popover'),
			);
	}
}
