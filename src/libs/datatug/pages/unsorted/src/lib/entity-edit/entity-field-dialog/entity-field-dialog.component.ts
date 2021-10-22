import { Component, Inject, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { DataType, IEntityFieldDef } from '@sneat/datatug/models';

@Component({
	selector: 'datatug-entity-field-dialog',
	templateUrl: './entity-field-dialog.component.html',
	styleUrls: ['./entity-field-dialog.component.scss'],
})
export class EntityFieldDialogComponent {
	public fieldId = '';
	public fieldType: DataType;
	public regexPattern: string;

	constructor(
		private readonly popoverCtrl: PopoverController,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger
	) {}

	complete(): void {
		let data: IEntityFieldDef = { id: this.fieldId, type: this.fieldType };
		if (this.regexPattern) {
			data = { ...data, namePattern: { regexp: this.regexPattern } };
		}
		this.popoverCtrl
			.dismiss(data, 'save')
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to dismiss popover')
			);
	}

	cancel(): void {
		this.popoverCtrl
			.dismiss(undefined, 'cancel')
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to dismiss popover')
			);
	}
}
