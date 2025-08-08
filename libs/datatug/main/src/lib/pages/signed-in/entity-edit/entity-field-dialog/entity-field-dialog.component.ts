import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonHeader,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonSelect,
	IonSelectOption,
	IonTitle,
	PopoverController,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IEntityFieldDef } from '../../../../models/definition/metapedia/entity';
import { DataType } from '../../../../models/definition/types';

@Component({
	selector: 'sneat-datatug-entity-field-dialog',
	templateUrl: './entity-field-dialog.component.html',
	imports: [
		IonHeader,
		IonTitle,
		IonList,
		IonItem,
		IonInput,
		IonLabel,
		IonSelect,
		IonSelectOption,
		FormsModule,
		IonButton,
	],
})
export class EntityFieldDialogComponent {
	private readonly popoverCtrl = inject(PopoverController);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

	protected fieldId = '';
	protected fieldType?: DataType;
	protected regexPattern?: string;

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
