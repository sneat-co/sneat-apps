import { Component, Inject, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'datatug-new-card-dialog',
	templateUrl: './new-card-dialog.component.html',
	styleUrls: ['./new-card-dialog.component.scss'],
})
export class NewCardDialogComponent {
	public cardTitle?: string;

	@ViewChild(IonInput) inputTitle?: IonInput;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalCtrl: ModalController
	) {}

	ionViewDidEnter() {
		setTimeout(() => {
			this.inputTitle
				?.setFocus()
				.catch((err) =>
					this.errorLogger.logError(err, 'Failed to set focus to title input')
				);
		}, 100);
	}

	selectCardType(cardType: 'sql' | 'http'): void {
		this.modalCtrl
			.dismiss({ cardType, title: this.cardTitle })
			.catch(this.errorLogger.logErrorHandler('Failed to dismiss modal'));
	}

	cancel(): void {
		this.modalCtrl
			.dismiss()
			.catch(
				this.errorLogger.logErrorHandler('Failed to dismiss modal on cancel')
			);
	}
}
