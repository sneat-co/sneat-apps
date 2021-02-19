import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {ActivatedRoute} from '@angular/router';
import {IonInput, NavController} from '@ionic/angular';
import {
  IDataTugProjectBrief, IOptionallyTitled, IProjBoard,
  IProjDbModelBrief,
  IProjectSummary, IProjEntity,
  IProjEnv, IProjItemBrief,
  ProjectItem,
  ProjectItemType
} from '@sneat/datatug/models';
import {IDatatugProjectContext} from '@sneat/datatug/nav';
import {DatatugNavContextService, DatatugNavService} from '@sneat/datatug/services/nav';
import {ProjectService} from '@sneat/datatug/services/project';
import {EntityService, EnvironmentService, SchemaService} from '@sneat/datatug/services/unsorted';
import {routingParamProjectId} from '@sneat/datatug/routes';
import {CreateNamedRequest} from '@sneat/datatug/dto';
import {IRecord} from '@sneat/data';

@Component({
	selector: 'datatug-project',
	templateUrl: './project.page.html',
})
export class ProjectPage implements OnInit, OnDestroy {

	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly Environment = ProjectItem.Environment as const;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly Board = ProjectItem.Board as const;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly DbModel = ProjectItem.DbModel as const;

	projContext: IDatatugProjectContext;
	projBrief: IDataTugProjectBrief;
	project: IProjectSummary;
	repoId: string;
	destroyed = new Subject<boolean>();
	@ViewChild(IonInput, {static: false}) addInput: IonInput;
	private projectSubscription: Subscription;

	constructor(
		readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly datatugNavService: DatatugNavService,
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly projectService: ProjectService,
		private readonly schemaService: SchemaService,
		private readonly environmentService: EnvironmentService,
		private readonly entityService: EntityService,
		private readonly navController: NavController,
	) {
		// console.log('ProjectPage.constructor()', route?.snapshot?.paramMap);
		try {
			this.datatugNavContextService.currentProject.subscribe({
				next: this.onProjectChanged,
				error: this.errorLogger.logErrorHandler('Failed to get current project'),
			});
			route.paramMap
				.subscribe({
					next: params => {
						try {
							const id = params.get(routingParamProjectId);
							console.log('project ID:', id);
							if (this.projBrief?.id !== id) {
								if (id) {
									this.projBrief = {id, title: id, store: {type: 'agent'}};
									this.onProjectIdChanged();
								}
							}
						} catch (e) {
							this.errorLogger.logError(e, 'Failed to process query parameters')
						}
					},
					error: this.errorLogger.logErrorHandler('Failed to get query parameters'),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to create ProjectPage');
		}
	}

	ngOnInit() {
		console.log('ProjectPage.ngOnInit()');
		const projBrief = history.state.proj as IDataTugProjectBrief;
		if (projBrief && (!this.projBrief || !this.projBrief.title && projBrief.id === this.projBrief.id)) {
			this.projBrief = projBrief;
			if (this.projBrief?.id) {
				this.onProjectIdChanged();
			}
		}
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
		this.datatugNavService.goEnvironment(this.projContext, projEnv);
	}

	public goProjFolder(projItemType: ProjectItemType): void {
		console.log('goProjFolder()', projItemType, this.projBrief);
		if (!this.projBrief.id) {
			this.errorLogger.logError(new Error('Can not navigate to project folder'), '!this.projBrief.id');
			return;
		}
		const url = `project/${this.projBrief.id}/${projItemType}s`;
		this.navController.navigateForward(url, {
				state: {
					projBrief: this.projBrief,
					project: this.project,
				},
			},
		).catch(err => this.errorLogger.logError(err, 'Failed to navigate to project item page: ' + url));
	}

	public goEntity(entity: IProjEntity): void {
		this.datatugNavService.goEntity(this.projContext, entity);
	}

	public goBoard(board: IProjBoard): void {
		this.datatugNavService.goBoard(this.projContext, board);
	}

	public getItemLink = (path: string) => (item: IProjItemBrief) => `${path}/${item.id}`;

	private onProjectChanged = (currentProject: IDatatugProjectContext): void => {
		console.log('currentProject:', currentProject);
		this.repoId = currentProject?.repoId;
		this.project = currentProject?.summary;
		this.projContext = currentProject;
		if (currentProject?.summary && !currentProject.summary.id) {
			this.errorLogger.logError(new Error('project have no id'));
		}
	}

	private onProjectIdChanged(): void {
		console.log('onProjectIdChanged()', this.projBrief);
		if (this.projectSubscription) {
			this.projectSubscription.unsubscribe();
		}
		// const id = this.projBrief?.id;
		// if (id) {
		// 	this.projectSubscription = this.projectService.watchProject(id)
		// 		.pipe(takeUntil(this.destroyed))
		// 		.subscribe({
		// 			next: project => {
		// 				console.log('project:', project);
		// 				this.project = project;
		// 				this.projBrief = {id, title: project.title};
		// 			},
		// 			error: err => this.errorLogger.logError(err, 'Failed to get project record'),
		// 		});
		// }
	}

	private createProjItem<T extends IOptionallyTitled>(
		projItemType: ProjectItem,
		name: string,
		create: (request: CreateNamedRequest) => Observable<IRecord<T>>,
	): Observable<IRecord<T>> {
		console.log('createProjItem()', projItemType, name);
		return create({project: this.projBrief.id, name: name.trim()})
			.pipe(
				tap(value => {
					console.log('project item created:', value);
					try {
						if (!this.project.environments) {
							this.project = {
								...this.project,
								environments: [],
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
		const itemId = projItem.id;
		const projectKey = this.repoId ? `${this.project.id}@${this.repoId}` : this.project.id;
		const url = `project/${projectKey}/${page}/${itemId}`;
		console.log('url:', url);
		this.navController
			.navigateForward(url, {
				state: {[page]: projItem},
				// queryParams: {id: entity.name, project: this.projBrief.id}
			})
			.catch(err => this.errorLogger.logError(err, `Failed to navigate to page "${page}"`));
	}
}
