import {Component, Inject, OnDestroy} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IDbServer, IProjDbServerSummary} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {DbServerService} from '@sneat/datatug/services/unsorted';
import {IProjectRef} from '@sneat/datatug/core';
import {ProjectContextService} from '@sneat/datatug/services/project';
import {AddDbServerComponent} from '@sneat/datatug/db';

@Component({
	selector: 'datatug-servers',
	templateUrl: './servers-page.component.html',
})
export class ServersPageComponent implements OnDestroy {
	tab: 'db' | 'web' | 'api' = 'db';

	dbServers: IProjDbServerSummary[];

	private readonly destroyed = new Subject<void>();
	private target: IProjectRef;
	private readonly isDeletingServer: { [id: string]: boolean } = {};

	constructor(
		private readonly projectContextService: ProjectContextService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalCtrl: ModalController,
		private readonly navCtrl: NavController,
		private readonly dbServerService: DbServerService,
	) {
		this.projectContextService.current$
			.pipe(takeUntil(this.destroyed))
			.subscribe(target => {
				if (target && (this.target?.storeId !== target?.storeId || this.target?.projectId !== target?.projectId)) {
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
			.navigateForward(['project', '.@' + this.target.storeId, 'servers', 'db', dbServer.dbServer.driver, dbServer.dbServer.host])
			.catch(err => this.errorLogger.logError(err, 'Failed to navigate to DB server page'));
	}

	deleteDbServer(event: Event, dbServer: IProjDbServerSummary): void {
		console.log('deleteDbServer', dbServer);
		event.preventDefault();
		event.stopPropagation();
		const id = serverId(dbServer.dbServer);
		this.isDeletingServer[id] = true;
		this.dbServerService
			.deleteDbServer(dbServer.dbServer)
			.subscribe({
				next: () => {
					this.dbServers = this.dbServers.filter(s => s !== dbServer);
					delete this.isDeletingServer[id];
				},
				error: err => {
					delete this.isDeletingServer[id];
					this.errorLogger.logError(err, 'Failed to remove DB server from project');
				},
			});
	}

	public isDeleting(dbServer: IDbServer): boolean {
		return this.isDeletingServer[serverId(dbServer)];
	}

	addDbServer() {
		this.modalCtrl.create({component: AddDbServerComponent})
			.then(modal => {
				modal.onDidDismiss().then((result) => {
					const projDbServerSummary = result.data as IProjDbServerSummary;
					console.log('projDbServerSummary:', projDbServerSummary);
					this.dbServers.push(projDbServerSummary);
				});
				modal.present()
					.catch(err => this.errorLogger.logError(err, 'Failed to present AddDbServerComponent as modal'));
			})
			.catch(err => this.errorLogger.logError(err, 'Failed to create a modal for AddDbServerComponent'));
	}


	private loadDbServers(target: IProjectRef): void {
		this.dbServerService
			.getDbServers(target)
			.subscribe({
				next: dbServers => {
					this.dbServers = dbServers || [];
					console.log('dbServers:', dbServers);
				},
				error: err => this.errorLogger.logError(err, 'Failed to load list of DB servers'),
			});
	}
}

const serverId = (dbServer: IDbServer): string => [dbServer.driver, dbServer.host, '' + dbServer.port].join('/')
