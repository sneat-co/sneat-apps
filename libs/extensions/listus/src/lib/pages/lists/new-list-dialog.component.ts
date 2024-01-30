import {
	AfterViewInit,
	Component,
	Inject,
	Input,
	ViewChild,
} from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { IListInfo, ListType } from '../../dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-new-list-popover',
	templateUrl: 'new-list-dialog.component.html',
})
export class NewListDialogComponent implements AfterViewInit {
	@ViewChild('listNameInput', { static: false }) listNameInput?: IonInput;

	public listName = '';
	public visibility: 'personal' | 'family' = 'personal';

	@Input() title?: string;
	@Input() listType?: ListType;
	@Input() modal?: ModalController;

	constructor(
		private readonly modalCtrl: ModalController,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.listNameInput?.setFocus().catch(this.errorLogger.logError);
		}, 250);
	}

	createList(): void {
		if (!this.listType) {
			this.errorLogger.logError('list type is not set');
			return;
		}
		const listInfo: IListInfo = {
			team: {
				type: this.visibility,
				title:
					this.visibility.substr(0, 1).toUpperCase() +
					this.visibility.substr(1),
			},
			type: this.listType,
			title: this.listName,
			emoji: '📝',
		};
		this.closeDialog(listInfo).catch(this.errorLogger.logError);
	}

	cancel(): void {
		console.log('cancel()');
		this.closeDialog().catch(this.errorLogger.logError);
	}

	async closeDialog(listInfo?: IListInfo): Promise<void> {
		await this.modal?.dismiss(listInfo, 'cancel');
	}
}
