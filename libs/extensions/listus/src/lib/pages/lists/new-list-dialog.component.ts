import {
	AfterViewInit,
	Component,
	Inject,
	Input,
	ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonCol,
	IonContent,
	IonFooter,
	IonGrid,
	IonHeader,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonRadio,
	IonRadioGroup,
	IonRow,
	IonTitle,
	IonToolbar,
	ModalController,
} from '@ionic/angular/standalone';
import { IListInfo, ListType } from '../../dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-new-list-popover',
	templateUrl: 'new-list-dialog.component.html',
	imports: [
		IonHeader,
		IonContent,
		IonList,
		IonItem,
		IonInput,
		FormsModule,
		IonTitle,
		IonToolbar,
		IonRadioGroup,
		IonRadio,
		IonLabel,
		IonFooter,
		IonGrid,
		IonRow,
		IonCol,
		IonButton,
	],
})
export class NewListDialogComponent implements AfterViewInit {
	@ViewChild('listNameInput', { static: false }) listNameInput?: IonInput;

	public listName = '';
	public visibility: 'private' | 'family' = 'private';

	@Input() title?: string;
	@Input() listType?: ListType;
	@Input() modal?: ModalController;

	constructor(
		private readonly modalCtrl: ModalController,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	ngAfterViewInit(): void /* Intentionally not ngOnInit */ {
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
			space: {
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
