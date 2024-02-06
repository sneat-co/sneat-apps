import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WormholeModule } from '@sneat/wormhole';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
	IonicModule,
	NavController,
	ToastController,
	ViewDidEnter,
	ViewDidLeave,
} from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IEntity, IProjEntity } from '@sneat/datatug-models';
import { IProjectContext } from '@sneat/datatug-nav';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	DatatugNavContextService,
	DatatugNavService,
} from '@sneat/datatug-services-nav';
import { EntityService } from '@sneat/datatug-services-unsorted';
import { IRecord } from '@sneat/data';

type Entities = IRecord<IEntity>[];

@Component({
	selector: 'sneat-datatug-entities',
	templateUrl: './entities-page.component.html',
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, WormholeModule, RouterLink],
})
export class EntitiesPageComponent
	implements OnDestroy, ViewDidEnter, ViewDidLeave
{
	entities?: Entities;
	project?: IProjectContext;
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

	protected isActiveView = false;

	ionViewDidEnter(): void {
		console.log('ionViewDidEnter()');
		this.isActiveView = true;
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
		if (!this.project?.ref) {
			return undefined as unknown as string; // TODO: fix typing
		}
		return this.datatugNavService.projectPageUrl(
			this.project.ref,
			'entity',
			entity.id,
		);
	}

	goNewEntity(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.datatugNavService.goProjPage('new-entity', this.project);
	}

	goEntity(entity: IProjEntity): void {
		if (!this.project?.ref) {
			return;
		}
		this.datatugNavService.goEntity(this.project, entity);
	}

	deleteEntity(event: Event, entity: IProjEntity): void {
		event?.stopPropagation();
		event?.preventDefault();
		if (!this.project?.ref) {
			return;
		}
		this.entityService.deleteEntity(this.project.ref, entity.id).subscribe({
			next: async () => {
				this.entities = (this.entities as IProjEntity[]).filter(
					(v) => v.id !== entity.id,
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
		if (!this.project) {
			return;
		}
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
