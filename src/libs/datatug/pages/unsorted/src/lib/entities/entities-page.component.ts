import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
	NavController,
	ToastController,
	ViewDidEnter,
	ViewDidLeave,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { IEntity, IProjEntity } from '@sneat/datatug/models';
import { IProjectContext } from '@sneat/datatug/nav';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	DatatugNavContextService,
	DatatugNavService,
} from '@sneat/datatug/services/nav';
import { EntityService } from '@sneat/datatug/services/unsorted';
import { IRecord } from '@sneat/data';

type Entities = IRecord<IEntity>[];

@Component({
	selector: 'datatug-entities',
	templateUrl: './entities-page.component.html',
})
export class EntitiesPageComponent
	implements OnDestroy, ViewDidEnter, ViewDidLeave
{
	entities: Entities;
	project: IProjectContext;
	private readonly destroyed = new Subject<void>();

	constructor(
		private readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private navCtrl: NavController,
		private readonly datatugNavService: DatatugNavService,
		private readonly navContextService: DatatugNavContextService,
		private readonly entityService: EntityService,
		private readonly toastCtrl: ToastController
	) {
		navContextService.currentProject.pipe(takeUntil(this.destroyed)).subscribe({
			next: (currentProject) => {
				this.project = currentProject;
				this.loadEntities();
				// if (currentProject?.brief && !this.entities) {
				// 	if (currentProject?.summary?.entities) {
				// 		this.setEntities([
				// 			...currentProject.summary.entities.map(entity => ({
				// 				id: entity.id,
				// 				data: entity as IEntity,
				// 			}))
				// 		]);
				// 	}
				// 	// this.loadEntities();
				// }
			},
			error: (err) =>
				this.errorLogger.logError(err, 'Failed to get current project context'),
		});
	}

	public isActiveView: boolean;

	ionViewWillEnter(): void {
		console.log('ionViewWillEnter()');
		this.isActiveView = true;
	}

	ionViewDidEnter(): void {
		console.log('ionViewDidEnter()');
	}

	ionViewDidLeave(): void {
		console.log('ionViewDidLeave()');
		this.isActiveView = false;
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	entityUrl(entity: IProjEntity): string {
		return this.datatugNavService.projectPageUrl(
			this.project.ref,
			'entity',
			entity.id
		);
	}

	goNewEntity(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.datatugNavService.goProjPage(this.project, 'new-entity');
	}

	goEntity(entity: IProjEntity): void {
		this.datatugNavService.goEntity(this.project, entity);
	}

	deleteEntity(event: Event, entity: IProjEntity): void {
		event?.stopPropagation();
		event?.preventDefault();
		this.entityService.deleteEntity(this.project.ref, entity.id).subscribe({
			next: async () => {
				this.entities = (this.entities as IProjEntity[]).filter(
					(v) => v.id !== entity.id
				);
				const toast = await this.toastCtrl.create({
					position: 'top',
					header: 'Success',
					message: 'Entity deleted',
					duration: 2000,
					buttons: ['OK'],
				});
				await toast.present();
			},
			error: (err) => this.errorLogger.logError(err, 'Failed to delete entity'),
		});
	}

	trackById = (i: number, r: IRecord<IEntity>) => r.id || i;

	private loadEntities(): void {
		this.entityService
			.getAllEntities(this.project.ref)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: (entities) => this.setEntities(entities),
				error: (err) =>
					this.errorLogger.logError(err, 'Failed to load project entities'),
			});
	}

	private setEntities(entities: Entities): void {
		//console.log('entities', [...entities]);
		this.entities = entities.sort((a, b) => (a.id > b.id ? 1 : -1));
		//console.log('this.entities', this.entities);
	}
}
