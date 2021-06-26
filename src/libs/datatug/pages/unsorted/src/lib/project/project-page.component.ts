import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {merge, Observable, Subject, Subscription} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {ActivatedRoute} from '@angular/router';
import {IonInput, NavController, ViewWillEnter} from '@ionic/angular';
import {
	IDatatugProjectBriefWithIdAndStoreRef,
	IOptionallyTitled,
	IProjBoard,
	IProjDbModelBrief,
	IProjectSummary,
	IProjEntity,
	IProjEnv,
	IProjItemBrief,
	ProjectItem,
	ProjectItemType
} from '@sneat/datatug/models';
import {IProjectContext} from '@sneat/datatug/nav';
import {DatatugNavContextService, DatatugNavService, ProjectTracker} from '@sneat/datatug/services/nav';
import {ProjectService} from '@sneat/datatug/services/project';
import {EntityService, EnvironmentService, SchemaService} from '@sneat/datatug/services/unsorted';
import {IProjectRef} from '@sneat/datatug/core';
import {CreateNamedRequest} from '@sneat/datatug/dto';
import {IRecord} from '@sneat/data';
import {parseStoreRef} from '@sneat/core';


@Component({
	selector: 'datatug-project',
	templateUrl: './project-page.component.html',
})
export class ProjectPageComponent implements OnInit, OnDestroy, ViewWillEnter {

	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly Environment = ProjectItem.Environment as const;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly Board = ProjectItem.Board as const;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly DbModel = ProjectItem.DbModel as const;

	project: IProjectContext;

	destroyed = new Subject<boolean>();
	@ViewChild(IonInput, {static: false}) addInput: IonInput;
	private projectSubscription: Subscription;

	isActiveView = false;

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
		console.log('ProjectPage.constructor()', route?.snapshot?.paramMap);
		this.projectTracker = new ProjectTracker(this.destroyed, route);
		this.projectTracker.projectRef.subscribe(this.setProjRef);
		this.project = window.history.state.project as IProjectContext;

	}

	private setProjRef = (ref: IProjectRef) => {
		if (ref.projectId === this.project?.ref?.projectId) {
			this.project = {ref, store: {ref: parseStoreRef(ref.storeId)}};
		}
		this.projectService.watchProjectSummary(ref).pipe(
			takeUntil(merge([this.projectTracker.projectRef, this.destroyed])),
		).subscribe({
			next: summary => this.onProjectSummaryChanged(ref, summary),
		});
	}

	ionViewWillEnter(): void {
		this.isActiveView = true;
	}

	ionViewDidLeave(): void {
		this.isActiveView = false;
	}

	ngOnInit() {
		console.log('ProjectPage.ngOnInit()');
		const projBrief = history.state.proj as IDatatugProjectBriefWithIdAndStoreRef;
		// if (projBrief && (!this.projBrief || !this.projBrief.title && projBrief.id === this.projBrief.id)) {
		// 	this.projBrief = projBrief;
		// 	if (this.projBrief?.id) {
		// 		this.onProjectIdChanged();
		// 	}
		// }
	}

	ngOnDestroy(): void {
		console.log('ProjectPage.ngOnDestroy()');
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	public createSchema = (title: string) => this.createProjItem(ProjectItem.DbModel, title, this.schemaService.createSchema)

	public createEnvironment = (title: string) =>
		this.createProjItem(ProjectItem.Environment, title, this.environmentService.createEnvironment)

	public goDbModel(dbModelBrief: IProjDbModelBrief): void {
		this.goProjItemPage(ProjectItem.DbModel, dbModelBrief);
	}

	// public createEntity = (title: string) => {
	// 	return this.createProjItem(ProjectItem.Entity, title, this.entityService.createEntity);
	// }

	public goEnvironment(projEnv: IProjEnv): void {
		this.datatugNavService.goEnvironment(this.project, projEnv);
	}

	public goProjFolder(projItemType: ProjectItemType): void {
		console.log('goProjFolder()', projItemType, this.project.ref);
		if (!this.project?.ref?.projectId) {
			this.errorLogger.logError(new Error('Can not navigate to project folder'), '!this.projBrief.id');
			return;
		}
		const url = `project/${this.project.ref.projectId}/${projItemType}s`;
		this.navController.navigateForward(url, {
				state: {
					project: this.project,
				},
			},
		).catch(err => this.errorLogger.logError(err, 'Failed to navigate to project item page: ' + url));
	}

	public goEntity(entity: IProjEntity): void {
		this.datatugNavService.goEntity(this.project, entity);
	}

	public goBoard(board: IProjBoard): void {
		this.datatugNavService.goBoard(this.project, board);
	}

	public getItemLink = (path: string) => (item: IProjItemBrief) => `${path}/${item.id}`;

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

	private onProjectSummaryChanged(ref: IProjectRef, summary: IProjectSummary): void {
		console.log('onProjectSummaryChanged:', ref, summary);
		if (!summary) {
			return;
		}
		this.project = {
			...this.project,
			brief: {access: summary.access, title: summary.title},
			summary,
		};
	}

	private createProjItem<T extends IOptionallyTitled>(
		projItemType: ProjectItem,
		name: string,
		create: (request: CreateNamedRequest) => Observable<IRecord<T>>,
	): Observable<IRecord<T>> {
		console.log('createProjItem()', projItemType, name);
		return create({project: this.project.ref.projectId, name: name.trim()})
			.pipe(
				tap(value => {
					console.log('project item created:', value);
					try {
						if (!this.project.summary.environments) {
							this.project = {
								...this.project,
								summary: {...this.project.summary, environments: []},
							}
						}
						const projItemBrief = {id: value.id, title: value.data?.title};
						// this.project.environments.push(projItemBrief)
						this.goProjItemPage(projItemType, projItemBrief);
					} catch (err) {
						this.errorLogger.logError(err, 'Failed to process API response');
					}
				}),
				// catchError(err => {
				// 	this.errorLogger.logError(err, 'Failed to create ' + projItemType);
				// 	return throwError(err);
				// }),
			);
	}

	private goProjItemPage(page: ProjectItemType, projItem: IProjItemBrief): void {
		console.log('goProjItemPage()', page, projItem, this.project);
		switch (page) {
			case ProjectItem.Environment:
				page = 'env' as ProjectItemType;
				break;
		}
		this.datatugNavService.goProjPage(this.project, page, {projectContext: this.project});
	}
}
