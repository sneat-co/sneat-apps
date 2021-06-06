import {Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {IonInput, PopoverController} from '@ionic/angular';
import {EntityFieldDialogComponent} from './entity-field-dialog/entity-field-dialog.component';
import {IEntity, IEntityField} from '@sneat/datatug/models';
import {IDatatugProjectContext} from '@sneat/datatug/nav';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {EntityService} from '@sneat/datatug/services/unsorted';
import {IDatatugProjRef} from '@sneat/datatug/core';
import {DatatugNavContextService, DatatugNavService} from '@sneat/datatug/services/nav';

@Component({
	selector: 'datatug-entity-edit',
	templateUrl: './entity-edit.page.html',
})
export class EntityEditPage implements OnDestroy {

	mode: 'new' | 'edit';
	public entity: IEntity = {fields: []};
	backUrl = '/';
	currentProject: IDatatugProjectContext;
	@ViewChild('nameInput') nameInput: IonInput;
	public error: any;
	public showNewPropForm: boolean;
	private readonly destroyed = new Subject<void>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly navContextService: DatatugNavContextService,
		private readonly entityService: EntityService,
		private readonly datatugNavService: DatatugNavService,
		private readonly popoverCtrl: PopoverController,
	) {
		try {
			this.mode = !route.snapshot.paramMap.get('entityId') ? 'new' : 'edit';
			this.entity = {
				fields: [],
			};
			this.showNewPropForm = true;
			navContextService.currentProject.subscribe({
				next: currentProject => {
					try {
						console.log('EntityEditPage: currentProject:', currentProject);
						this.currentProject = currentProject;
						this.backUrl = currentProject ? `/project/${currentProject.brief.id}@${currentProject.storeId}/entities` : '/';
					} catch (e) {
						this.errorLogger.logError(e, 'Failed to process current project');
					}
				},
			});
		} catch (e) {
			this.error = this.errorLogger.logError(e, 'Failed in EntityEditPage.constructor()');
		}
	}

	ionViewDidEnter() {
	  try {
      this.nameInput
        // @ts-ignore: TODO: TS2339: Property 'setFocus' does not exist on type 'IonInput'.
        .setFocus()
        .catch(e => this.errorLogger.logError(e, 'Failed to set focus to "name" input'));
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to process ionViewDidEnter');
    }
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	createEntity(): void {
		console.log('createEntity()');
		try {
			const projectContext: IDatatugProjRef = {...this.currentProject};
			this.entityService.createEntity(projectContext, this.entity).subscribe({
				next: value => {
					console.log('Entity created:', value);
					this.datatugNavService.goEntity(projectContext, {id: value.id, title: value.data.title});
				},
			})
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to create entity');
		}
	}

	saveEntityChanges(): void {
		console.log('saveEntityChanges()');
	}

	async addProperty(event: Event) {
		const popover = await this.popoverCtrl.create({
			component: EntityFieldDialogComponent,
			event,
		});
		popover.onDidDismiss().then((response) => {
			console.log('response:', response);
			this.entity = {...this.entity, fields: [...this.entity.fields, response.data as IEntityField]};
			console.log('entity', this.entity);
		});
		return await popover.present();
	}

	deleteField(id: string): void {
		console.log('deleteField', id);
		this.entity = {...this.entity, fields: this.entity.fields.filter(f => f.id !== id)};
	}
}
