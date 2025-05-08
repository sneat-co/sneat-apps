import { Component, Inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonSelect,
	IonSelectOption,
	ModalController,
} from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { IDbServer } from '@sneat/ext-datatug-models';
import { DbServerService } from '@sneat/ext-datatug-services-unsorted';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-datatug-add-db-serve',
	templateUrl: './add-db-server.component.html',
	imports: [
		IonHeader,
		IonButtons,
		IonButton,
		IonContent,
		IonList,
		IonItem,
		IonLabel,
		IonSelect,
		IonSelectOption,
		IonInput,
		FormsModule,
		IonIcon,
	],
})
export class AddDbServerComponent implements OnDestroy {
	readonly dbServer: IDbServer = {
		driver: 'sqlserver',
		host: '',
	};
	submitting = false;
	private readonly destroyed = new Subject<void>();

	constructor(
		private readonly modalCtrl: ModalController,
		private readonly dbServerService: DbServerService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	ngOnDestroy() {
		this.destroyed.next();
	}

	close(): void {
		this.modalCtrl.dismiss().catch(this.errorLogger.logErrorHandler);
	}

	submit(): void {
		this.submitting = true;
		this.dbServerService.addDbServer(this.dbServer).subscribe({
			next: (dbServerSummary) => {
				console.log('dbServerSummary', dbServerSummary);
				this.modalCtrl
					.dismiss(dbServerSummary)
					.catch((err) =>
						this.errorLogger.logError(err, 'Failed to dismiss modal'),
					);
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to add server to project');
				this.submitting = false;
			},
		});
	}
}
