import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatatugFolderComponent } from '@sneat/ext-datatug-folders-ui';
import { DatatugServicesStoreModule } from '@sneat/ext-datatug-services-repo';
import { WormholeModule } from '@sneat/wormhole';
import { race, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ActivatedRoute } from '@angular/router';
import {
	IonBackButton,
	IonButtons,
	IonCard,
	IonContent,
	IonHeader,
	IonInput,
	IonItem,
	IonLabel,
	IonMenuButton,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
	NavController,
	ViewDidLeave,
	ViewWillEnter,
} from '@ionic/angular/standalone';
import {
	IProjBoard,
	IProjDbModelBrief,
	IProjectSummary,
	IProjEntity,
	IProjEnv,
	IProjItemBrief,
	ProjectItem,
	ProjectItemType,
} from '@sneat/ext-datatug-models';
import { IProjectContext } from '@sneat/ext-datatug-nav';
import {
	DatatugNavContextService,
	DatatugNavService,
	DatatugServicesNavModule,
	ProjectTopLevelPage,
	ProjectTracker,
} from '@sneat/ext-datatug-services-nav';
import {
	DatatugServicesProjectModule,
	ProjectService,
} from '@sneat/ext-datatug-services-project';
import {
	DatatugServicesUnsortedModule,
	EntityService,
	EnvironmentService,
	SchemaService,
} from '@sneat/ext-datatug-services-unsorted';
import { DatatugCoreModule, IProjectRef } from '@sneat/ext-datatug-core';
import { parseStoreRef } from '@sneat/core';

@Component({
	selector: 'sneat-datatug-project',
	templateUrl: './project-page.component.html',
	imports: [
		FormsModule,
		DatatugCoreModule,
		DatatugServicesNavModule,
		DatatugServicesProjectModule,
		DatatugServicesStoreModule,
		DatatugServicesUnsortedModule,
		WormholeModule,
		DatatugFolderComponent,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonMenuButton,
		IonBackButton,
		IonTitle,
		IonContent,
		IonCard,
		IonItem,
		IonLabel,
		IonInput,
		IonSelect,
		IonSelectOption,
	],
})
export class ProjectPageComponent
	implements OnInit, OnDestroy, ViewWillEnter, ViewDidLeave
{
	// readonly DbModel = ProjectItem.dbModel as const;

	protected project?: IProjectContext;

	protected destroyed = new Subject<boolean>();
	@ViewChild(IonInput, { static: false }) addInput?: IonInput;

	protected isActiveView = false;

	private readonly projectTracker: ProjectTracker;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly datatugNavService: DatatugNavService,
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly projectService: ProjectService,
		private readonly schemaService: SchemaService,
		private readonly environmentService: EnvironmentService,
		private readonly entityService: EntityService,
		private readonly navController: NavController,
	) {
		console.log(
			'ProjectPageComponent.constructor()',
			route?.snapshot?.paramMap,
		);
		this.projectTracker = new ProjectTracker(this.destroyed, route);
		this.projectTracker.projectRef.subscribe({
			next: this.setProjRef,
			error: this.errorLogger.logErrorHandler(
				'Failed to get project ref for ProjectPageComponent',
			),
		});
	}

	private setProjRef = (ref: IProjectRef) => {
		console.log('ProjectPageComponent.setProjRef()', ref);
		try {
			if (ref.projectId === this.project?.ref?.projectId) {
				this.project = { ref, store: { ref: parseStoreRef(ref.storeId) } };
			}
			this.projectService
				.watchProjectSummary(ref)
				.pipe(
					takeUntil(
						race([
							this.projectTracker.projectRef.pipe(skip(1)),
							this.destroyed,
						]),
					),
				)
				.subscribe({
					next: (summary) => this.onProjectSummaryChanged(ref, summary),
					error: this.errorLogger.logErrorHandler(
						'Failed to load project summary for project page',
					),
				});
		} catch (e) {
			this.errorLogger.logError(
				e,
				'Failed to set projectRef at ProjectPageComponent',
			);
		}
	};

	ionViewWillEnter(): void {
		this.isActiveView = true;
	}

	ionViewDidLeave(): void {
		this.isActiveView = false;
	}

	ngOnInit() {
		console.log('ProjectPageComponent.ngOnInit()');
	}

	ngOnDestroy(): void {
		console.log('ProjectPageComponent.ngOnDestroy()');
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	// noinspection JSUnusedGlobalSymbols
	protected goDbModel(dbModelBrief: IProjDbModelBrief): void {
		this.goProjItemPage(ProjectItem.dbModel, dbModelBrief);
	}

	// public createEntity = (title: string) => {
	// 	return this.createProjItem(ProjectItem.Entity, title, this.entityService.createEntity);
	// }

	// noinspection JSUnusedGlobalSymbols
	protected goEnvironment(projEnv: IProjEnv): void {
		this.datatugNavService.goEnvironment(this.project, projEnv);
	}

	// noinspection JSUnusedGlobalSymbols
	protected goProjFolder(projItemType: ProjectItemType): void {
		console.log('goProjFolder()', projItemType, this.project?.ref);
		if (!this.project?.ref?.projectId) {
			this.errorLogger.logError(
				new Error('Can not navigate to project folder'),
				'!this.projBrief.id',
			);
			return;
		}
		const url = `project/${this.project.ref.projectId}/${projItemType}s`;
		this.navController
			.navigateForward(url, {
				state: {
					project: this.project,
				},
			})
			.catch((err) =>
				this.errorLogger.logError(
					err,
					'Failed to navigate to project item page: ' + url,
				),
			);
	}

	// noinspection JSUnusedGlobalSymbols
	protected goEntity(entity: IProjEntity): void {
		if (!this.project) {
			return;
		}
		this.datatugNavService.goEntity(this.project, entity);
	}

	// noinspection JSUnusedGlobalSymbols
	protected goBoard(board: IProjBoard): void {
		if (!this.project) {
			return;
		}
		this.datatugNavService.goBoard(this.project, board);
	}

	// noinspection JSUnusedGlobalSymbols
	protected getItemLink = (path: string) => (item: IProjItemBrief) =>
		`${path}/${item.id}`;

	// private onProjectIdChanged(): void {
	// 	console.log('ProjectPageComponent.onProjectIdChanged()', this.project.ref);
	// 	if (this.projectSubscription) {
	// 		this.projectSubscription.unsubscribe();
	// 	}
	// 	if (this.project?.ref) {
	// 		this.projectSubscription = this.projectService.watchProjectSummary(this.project.ref).pipe(
	// 			takeUntil(this.destroyed),
	// 		).subscribe({
	// 			next: projectSummary => this.onProjectSummaryChanged(this.project.ref, projectSummary),
	//
	// 		});
	// 	}
	// }

	private onProjectSummaryChanged(
		ref: IProjectRef,
		summary?: IProjectSummary,
	): void {
		console.log(
			'ProjectPageComponent.onProjectSummaryChanged():',
			ref,
			summary,
		);
		if (!summary) {
			return;
		}
		this.project = {
			...this.project,
			ref,
			brief: { access: summary.access, title: summary.title },
			summary,
		};
	}

	private goProjItemPage(
		page: ProjectItemType,
		projItem: IProjItemBrief,
	): void {
		console.log('goProjItemPage()', page, projItem, this.project);
		switch (page) {
			case ProjectItem.environment:
				page = 'env' as ProjectItemType;
				break;
		}
		this.datatugNavService.goProjPage(page, this.project, {
			projectContext: this.project,
		});
	}

	goTo(event: CustomEvent): void {
		const page = event.detail.value as ProjectTopLevelPage;
		this.datatugNavService.goProject(this.project, page);
	}
}
