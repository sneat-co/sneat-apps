import {Component, Inject, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {IEntity, IProjEntity, IRecord} from '@sneat/datatug/models';
import {IDatatugProjectContext} from '@sneat/datatug/nav';
import {IProjectContext} from '@sneat/datatug/core';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {DatatugNavContextService, DatatugNavService} from '@sneat/datatug/services/nav';
import {EntityService} from '@sneat/datatug/services/unsorted';

type Entities = IRecord<IEntity>[];

@Component({
	selector: 'datatug-entities',
	templateUrl: './entities.page.html',
})
export class EntitiesPage implements OnDestroy {

	entities: Entities;
	currentProject: IDatatugProjectContext;
	projectContext: IProjectContext;
	private readonly destroyed = new Subject<void>();

	constructor(
		private readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private navCtrl: NavController,
		private readonly datatugNavService: DatatugNavService,
		private readonly navContextService: DatatugNavContextService,
		private readonly entityService: EntityService,
		private readonly toastCtrl: ToastController,
	) {
		navContextService.currentProject
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: currentProject => {
					this.currentProject = currentProject;
					this.projectContext = currentProject?.brief && {
						repoId: currentProject.repoId,
						projectId: currentProject.brief?.id
					};
					if (currentProject?.brief && !this.entities) {
						if (currentProject?.summary?.entities) {
							this.setEntities([
								...currentProject.summary.entities.map(entity => ({
									id: entity.id,
									data: entity as IEntity,
								}))
							]);
						}
						// this.loadEntities();
					}
				},
				error: err => this.errorLogger.logError(err, 'Failed to get current project context'),
			});
	}

	public get projectUrlId() {
		return `${this.currentProject.brief.id}@${this.currentProject.repoId}`;
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	entityUrl(entity: IProjEntity): string {
		return this.datatugNavService.projectPageUrl(this.currentProject, 'entity', entity.id);
	}

	goNewEntity(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.datatugNavService.goProjPage(this.currentProject.repoId, this.currentProject.brief.id, 'new-entity');
	}

	goEntity(entity: IProjEntity): void {
		this.datatugNavService.goEntity(this.currentProject, entity);
	}

	deleteEntity(event: Event, entity: IProjEntity): void {
		event?.stopPropagation();
		event?.preventDefault();
		this.entityService.deleteEntity(this.projectContext, entity.id)
			.subscribe({
				next: async () => {
					this.entities = (this.entities as IProjEntity[]).filter(v => v.id !== entity.id);
					const toast = await this.toastCtrl.create({
						position: 'top',
						header: 'Success',
						message: 'Entity deleted',
						duration: 2000,
						buttons: ['OK'],
					});
					await toast.present();
				},
				error: err => this.errorLogger.logError(err, 'Failed to delete entity'),
			});
	}

	trackById = (i: number, r: IRecord<IEntity>) => r.id || i;

	private loadEntities(): void {
		this.entityService
			.getAllEntities(this.projectContext)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: entities => this.setEntities(entities),
				error: err => this.errorLogger.logError(err, 'Failed to load project entities'),
			})
	}

	private setEntities(entities: Entities): void {
		//console.log('entities', [...entities]);
		this.entities = entities.sort((a, b) => a.id > b.id ? 1 : -1);
		//console.log('this.entities', this.entities);
	}
}
