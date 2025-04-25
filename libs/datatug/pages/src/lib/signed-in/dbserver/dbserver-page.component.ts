import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	IonBackButton,
	IonBadge,
	IonButton,
	IonButtons,
	IonCard,
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
} from '@ionic/angular/standalone';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	getDbServerFromId,
	IDbCatalogSummary,
	IDbServer,
	IDbServerSummary,
} from '@sneat/ext-datatug-models';
import { ProjectContextService } from '@sneat/ext-datatug-services-project';
import { DbServerService } from '@sneat/ext-datatug-services-unsorted';

@Component({
	selector: 'sneat-datatug-dbserver',
	templateUrl: './dbserver-page.component.html',
	imports: [
		CommonModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonMenuButton,
		IonTitle,
		IonContent,
		IonCard,
		IonItemDivider,
		IonIcon,
		IonLabel,
		IonItem,
		IonInput,
		IonSegment,
		IonSegmentButton,
		IonBadge,
		IonList,
		IonButton,
	],
})
export class DbserverPageComponent implements OnDestroy {
	tab: 'known' | 'unknown' = 'known';
	public dbServer?: IDbServer;
	public dbServerSummary?: IDbServerSummary;
	public dbServerCatalogs?: IDbCatalogSummary[];
	public loadingSummary = true;
	public loadingCatalogs = true;
	public envs?: string[];

	private readonly destroyed = new Subject<void>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly dbServerService: DbServerService,
		private readonly projectContextService: ProjectContextService,
	) {
		this.route.paramMap
			.pipe(
				takeUntil(this.destroyed),
				map((q) => {
					const id = q.get('dbServerId');
					const driver = q.get('dbDriver');
					return driver && id ? getDbServerFromId(driver, id) : undefined;
				}),
			)
			.subscribe((dbServer) => {
				this.dbServer = dbServer;
			});
		this.projectContextService.current$
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: (target) => {
					if (target) {
						this.loadData();
					}
				},
			});
	}

	ngOnDestroy() {
		console.log('DbserverPage.ngOnDestroy()');
		this.destroyed.next();
	}

	private loadData(): void {
		this.loadSummary();
		this.loadCatalogs();
	}

	private loadSummary(): void {
		this.loadingSummary = true;
		const dbServer = this.dbServer;
		if (!dbServer) {
			return;
		}
		this.dbServerService
			.getDbServerSummary(dbServer)
			.pipe(
				takeUntil(this.destroyed),
				// delay(1000),
			)
			.subscribe({
				next: (dbServerSummary) => {
					this.loadingSummary = false;
					this.dbServerSummary = dbServerSummary;
					this.envs = [];
					dbServerSummary.databases?.forEach((db) => {
						db.environments?.forEach((env) => {
							if (!this.envs?.includes(env)) {
								if (this.envs) {
									this.envs?.push(env);
								} else {
									this.envs = [env];
								}
							}
						});
					});
					this.removeAddedCatalogs();
				},
				error: (err) => {
					this.loadingSummary = false;
					this.errorLogger.logError(err, 'Failed to load DB server summary');
				},
			});
	}

	private loadCatalogs(): void {
		this.loadingCatalogs = true;
		const dbServer = this.dbServer;
		if (!dbServer) {
			return;
		}
		this.dbServerService
			.getServerDatabases({ dbServer })
			.pipe(
				takeUntil(this.destroyed),
				// delay(1000),
			)
			.subscribe({
				next: (catalogs) => {
					this.loadingCatalogs = false;
					this.dbServerCatalogs = catalogs;
					this.removeAddedCatalogs();
				},
				error: (err) => {
					this.loadingCatalogs = false;
					this.errorLogger.logError(err, 'Failed to load DB catalogs');
				},
			});
	}

	private removeAddedCatalogs(): void {
		if (this.dbServerSummary && this.dbServerCatalogs) {
			const { databases } = this.dbServerSummary;
			this.dbServerCatalogs = this.dbServerCatalogs.filter(
				(c) => !databases || !databases.some((db) => db.id === c.name),
			);
		}
	}
}
