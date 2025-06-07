import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonBackButton,
	IonBadge,
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCheckbox,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	IonMenuButton,
	IonSegment,
	IonSegmentButton,
	IonTitle,
	IonToolbar,
	ModalController,
	NavController,
} from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IDbServer, IProjDbServerSummary } from '@sneat/ext-datatug-models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { DbServerService } from '@sneat/ext-datatug-services-unsorted';
import { IProjectRef } from '@sneat/ext-datatug-core';
import { ProjectContextService } from '@sneat/ext-datatug-services-project';
import { AddDbServerComponent } from '@sneat/ext-datatug-db';

@Component({
	selector: 'sneat-datatug-servers',
	templateUrl: './servers-page.component.html',
	imports: [
		FormsModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
		IonCard,
		IonItemDivider,
		IonItem,
		IonCheckbox,
		IonLabel,
		IonInput,
		IonCardHeader,
		IonSegment,
		IonSegmentButton,
		IonList,
		IonIcon,
		IonCardContent,
		IonButton,
		IonBadge,
		IonMenuButton,
	],
})
export class ServersPageComponent implements OnDestroy {
	private readonly projectContextService = inject(ProjectContextService);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly modalCtrl = inject(ModalController);
	private readonly navCtrl = inject(NavController);
	private readonly dbServerService = inject(DbServerService);

	protected tab: 'db' | 'web' | 'api' = 'db';

	protected dbServers?: IProjDbServerSummary[];

	private readonly destroyed = new Subject<void>();
	private target?: IProjectRef;
	private readonly isDeletingServer: Record<string, boolean> = {};

	constructor() {
		this.projectContextService.current$
			.pipe(takeUntil(this.destroyed))
			.subscribe((target) => {
				if (
					target &&
					(this.target?.storeId !== target?.storeId ||
						this.target?.projectId !== target?.projectId)
				) {
					this.loadDbServers(target);
				}
				this.target = target;
			});
	}

	ngOnDestroy() {
		this.destroyed.next();
	}

	goDbServer(dbServer: IProjDbServerSummary): void {
		console.log('goServer', dbServer);
		this.navCtrl
			.navigateForward([
				'project',
				'.@' + this.target?.storeId,
				'servers',
				'db',
				dbServer.dbServer.driver,
				dbServer.dbServer.host,
			])
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to navigate to DB server page'),
			);
	}

	deleteDbServer(event: Event, dbServer: IProjDbServerSummary): void {
		console.log('deleteDbServer', dbServer);
		event.preventDefault();
		event.stopPropagation();
		const id = serverId(dbServer.dbServer);
		this.isDeletingServer[id] = true;
		this.dbServerService.deleteDbServer(dbServer.dbServer).subscribe({
			next: () => {
				this.dbServers = this.dbServers?.filter((s) => s !== dbServer);
				delete this.isDeletingServer[id];
			},
			error: (err) => {
				delete this.isDeletingServer[id];
				this.errorLogger.logError(
					err,
					'Failed to remove DB server from project',
				);
			},
		});
	}

	public isDeleting(dbServer: IDbServer): boolean {
		return this.isDeletingServer[serverId(dbServer)];
	}

	addDbServer() {
		this.modalCtrl
			.create({ component: AddDbServerComponent })
			.then((modal) => {
				modal.onDidDismiss().then((result) => {
					const projDbServerSummary = result.data as IProjDbServerSummary;
					console.log('projDbServerSummary:', projDbServerSummary);
					this.dbServers?.push(projDbServerSummary);
				});
				modal
					.present()
					.catch((err) =>
						this.errorLogger.logError(
							err,
							'Failed to present AddDbServerComponent as modal',
						),
					);
			})
			.catch((err) =>
				this.errorLogger.logError(
					err,
					'Failed to create a modal for AddDbServerComponent',
				),
			);
	}

	private loadDbServers(target: IProjectRef): void {
		this.dbServerService.getDbServers(target).subscribe({
			next: (dbServers) => {
				this.dbServers = dbServers || [];
				console.log('dbServers:', dbServers);
			},
			error: (err) =>
				this.errorLogger.logError(err, 'Failed to load list of DB servers'),
		});
	}
}

const serverId = (dbServer: IDbServer): string =>
	[dbServer.driver, dbServer.host, '' + dbServer.port].join('/');
