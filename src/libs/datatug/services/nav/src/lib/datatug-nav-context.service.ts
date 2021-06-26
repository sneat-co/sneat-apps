import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {distinctUntilChanged, distinctUntilKeyChanged, filter, first, map, shareReplay, tap} from 'rxjs/operators';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {ProjectContextService, ProjectService} from '@sneat/datatug/services/project';
import {DatatugProjStoreType, IProjectSummary} from '@sneat/datatug/models';
import {AppContextService, IProjectRef} from '@sneat/datatug/core';
import {EnvironmentService} from "@sneat/datatug/services/unsorted";
import {
	IDatatugNavContext,
	IProjectContext,
	IEnvContext,
	IEnvDbContext,
	IEnvDbTableContext, populateProjectBriefFromSummaryIfMissing
} from "@sneat/datatug/nav";
import {parseStoreRef, STORE_ID_GITHUB_COM, STORE_TYPE_GITHUB} from '@sneat/core';
import {RandomId} from '@sneat/random';

const
	reStore = /\/store\/(.+?)($|\/)/,
	reProj = /\/project\/(.+?)($|\/)/,
	reEnv = /\/env\/(.+?)(?:\/|$)/,
	reEnvDb = /\/env\/\w+\/db\/(.+?)(?:\/|$)/,
	reTable = /\/table\/(.+?)(?:\/|$)/
;


@Injectable({providedIn: 'root'})
export class DatatugNavContextService {
	readonly id = RandomId.newRandomId(5);
	private readonly $currentContext = new BehaviorSubject<IDatatugNavContext>({});
	public readonly currentContext = this.$currentContext.asObservable();

	private readonly $currentStoreId = new BehaviorSubject<string | undefined>(undefined);
	public readonly currentStoreId = this.$currentStoreId.asObservable().pipe(distinctUntilChanged());

	private readonly $currentProj = new BehaviorSubject<IProjectContext | undefined>(undefined);
	public readonly currentProject = this.$currentProj.asObservable().pipe(
		map(populateProjectBriefFromSummaryIfMissing),
		shareReplay(1),
	);

	private readonly $currentFolder = new BehaviorSubject<string>(undefined);
	public readonly currentFolder = this.$currentFolder.asObservable();

	private readonly $currentEnv = new BehaviorSubject<IEnvContext>(undefined);
	public readonly currentEnv = this.$currentEnv.asObservable().pipe(
		distinctUntilChanged((x, y) => !x && !y || x?.id === y?.id),
		tap(v => console.log('DatatugNavContextService => currentEnv changed:', v?.id)),
	);

	private readonly $currentEnvDb = new BehaviorSubject<IEnvDbContext | undefined>(undefined);
	public readonly currentEnvDb = this.$currentEnvDb.asObservable();

	private readonly $currentEnvDbTable = new BehaviorSubject<IEnvDbTableContext | undefined>(undefined);
	public readonly currentEnvDbTable = this.$currentEnvDbTable.asObservable();

	private navEndSubscription: Subscription;

	constructor(
		private readonly appContext: AppContextService,
		private readonly projectContextService: ProjectContextService,
		private readonly router: Router,
		private readonly projectService: ProjectService,
		private readonly envService: EnvironmentService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		console.log('DatatugNavContextService.constructor(), id=', this.id);
		this.currentProject.subscribe({
			next: p => {
				const projRef = projectContextService.current;
				if (projRef?.projectId !== p?.ref?.projectId || projRef?.storeId !== p?.ref?.storeId) {
					projectContextService.setCurrent(p?.ref)
				}
			},
			error: this.errorLogger.logErrorHandler('DatatugNavContextService failed to retrieve current project'),
		});
		// try {
		// 	throw new Error('stack');
		// } catch (e) {
		// 	this.errorLoggerService.logError(e, 'test');
		// }
		this.navEndSubscription = appContext.currentApp
			.pipe(distinctUntilKeyChanged('appCode'))
			.subscribe(app => {
				if (app.appCode !== 'datatug') {
					if (this.navEndSubscription) {
						this.navEndSubscription.unsubscribe();
					}
					return;
				}
				if (this.navEndSubscription) {
					return;
				}
				console.log('DatatugNavContextService.constructor() => app:', app.appCode);
				this.processUrl(location.href);
				this.navEndSubscription = this.router.events
					.pipe(
						filter(val => val instanceof NavigationEnd),
						map(val => val as NavigationEnd),
						distinctUntilKeyChanged('urlAfterRedirects'),
					)
					.subscribe({
							next: val => {
								console.log('DatatugNavContextService.constructor() => NavigationEnd:', val);
								this.processUrl(val.urlAfterRedirects);
							},
							error: err => this.errorLogger.logError(err, 'Failed to process router event')
						},
					);
			});
	}

	public setCurrentProject(projectContext?: IProjectContext): void {
		console.log('DatatugNavContextService.setCurrentProject()', projectContext);
		if (projectContext?.summary && !projectContext.summary.id) {
			this.errorLogger.logError(new Error('attempt to set current project with no ID'));
			return;
		}
		if (projectContext) {
			this.$currentStoreId.next(projectContext?.ref.storeId);
		}
		this.$currentProj.next(projectContext);
		if (!projectContext) {
			return;
		}
		const target = this.projectContextService.current;
		const projRef = projectContext?.ref;
		if (target?.storeId !== projectContext?.ref?.storeId || target?.projectId !== projectContext?.ref?.projectId) {
			this.projectContextService.setCurrent(projRef)
		}
		if (projectContext?.ref?.projectId) {
			this.projectService
				.watchProjectSummary(projRef)
				.subscribe({
					next: summary => this.onProjectSummaryChanged(projRef, summary),
					error: err => this.errorLogger.logError(err, 'Navigation context failed to get project summary', {show: false}),
				});
		}
	}

	private onProjectSummaryChanged(projRef: IProjectRef, summary: IProjectSummary): void {
		if (!summary) {
			// this.errorLogger.logError(new Error('Returned empty project summary'),
			// 	`project: ${projectContext.brief.id} @ ${projectContext.storeId}`);
			return;
		}
		console.log('DataTugNavContext => projectSummary:', summary);
		if (!summary.id) {
			summary = {...summary, id: projRef.projectId};
		}
		const currentProj = this.$currentProj.value;
		if (currentProj?.ref.projectId === summary.id) {
			this.$currentProj.next({...currentProj, summary});
		}
	}

	public setCurrentEnvironment(id?: string): void {
		console.log('DatatugNavContextService.setCurrentEnvironment()', id);
		if (this.$currentEnv.value?.id === id) {
			return;
		}
		const envContext: IEnvContext = id && {
			id,
			brief: this.$currentProj.value?.summary?.environments.find(env => env.id === id)
		};

		if (id && this.$currentProj.value?.ref) {
			this.envService.getEnvSummary(this.$currentProj.value.ref, id)
				.subscribe({
					next: envSummary => {
						if (!envSummary) {
							this.errorLogger.logError('API returned nothing for environmentId=' + id);
							return;
						}
						if (this.$currentEnv.value?.id === envSummary.id) {
							this.$currentEnv.next({
								...envContext,
								summary: envSummary
							})
						}
					},
					error: this.errorLogger.logErrorHandler('failed to get env summary')
				})
		}
		this.$currentEnv.next(envContext || undefined);
		//}
	}

	private processUrl(url: string): void {
		console.log('DatatugNavContextService: NavigationEnd =>', url);
		try {
			this.processStore(url);
			this.processProject(url);
			this.processEnvironment(url);
			this.processEnvDb(url);
			this.processEnvDbTable(url);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process URL');
		}
	}

	private processStore(url: string): void {
		const m = url.match(reStore);
		console.log('processStore', url, m);
		const storeId = m && m[1];
		this.$currentStoreId.next(storeId);
	}

	private processProject(url: string): void {
		const m = url.match(reProj);
		const id = m && m[1];
		if (!id) {
			this.setCurrentProject(undefined);
			return;
		}
		const currentProject = this.$currentProj.value;
		const currentStoreId = this.$currentStoreId.value;
		if (!currentProject || currentProject.ref.projectId !== id || currentProject.ref.storeId !== currentStoreId) {
			let storeType: DatatugProjStoreType;
			if (currentStoreId === STORE_ID_GITHUB_COM) {
				storeType = STORE_TYPE_GITHUB;
			} else {
				storeType = 'agent';
			}
			const projectContext: IProjectContext = {
				// brief: {access: undefined, title: undefined},
				store: {ref: parseStoreRef(currentStoreId)},
				ref: {projectId: id, storeId: currentStoreId},
			};
			this.setCurrentProject(projectContext);
		}
	}

	private processEnvironment(url: string): void {
		const m = url.match(reEnv);
		const id = m && m[1];
		if (id || !location.search.includes('env=')) {
			this.setCurrentEnvironment(id);
		}
		// console.log('processEnvironment', id);
	}

	private processEnvDb(url: string): void {
		const m = url.match(reEnvDb);
		const id = m && m[1];
		// console.log('processEnvDb', id);
		if (this.$currentEnvDb.value?.id !== id) {
			this.$currentEnvDb.next({id});
		}
	}

	private processEnvDbTable(url: string): void {
		const m = url.match(reTable);
		const id = m && m[1];
		// console.log('processEnvDbTable', id);
		if (!id) {
			if (this.$currentEnvDbTable.value) {
				this.$currentEnvDbTable.next(undefined);
			}
			return
		}
		const currentTable = this.$currentEnvDbTable.value;

		// eslint-disable-next-line prefer-const
		let [schema, name] = id.split('.');
		if (!name) {
			name = schema;
		}
		const project = this.$currentProj.value;
		if (currentTable?.name !== name || currentTable?.schema !== schema) {
			this.$currentEnvDbTable.next({name, schema});
			console.log('currentTable:', this.$currentEnvDbTable.value);
			this.projectService
				.getFull(project.ref)
				.pipe(first())
				.subscribe({
					next: p => {
						try {
							if (this.$currentEnvDbTable.value?.name !== name || this.$currentEnvDbTable.value?.schema !== schema) {
								return // TODO(help-wanted): Do it with a pipe operator that cancels subscription when table changes
							}
							const envId = this.$currentEnv.value?.id;
							const env = p.environments.find(e => e.id === envId);
							if (!env) {
								this.errorLogger.logError('unknown environment: ' + envId);
								return;
							}
							// const dbId = this.$currentEnvDb.value?.id;
							// const database = env.databases.find(db => db.id === dbId)
							// if (!database) {
							// 	this.errorLoggerService.logError('unknown db: ' + dbId);
							// 	return;
							// }
							// const meta = database.tables.find(t => t.name === name && t.schema === schema);
							// this.$currentEnvDbTable.next({...currentTable, meta, name: meta.name, schema: meta.schema});
						} catch (e) {
							this.errorLogger.logError(e, 'Failed to process project to get table meta');
						}
					},
					error: err => this.errorLogger.logError(err, 'Failed to load project'),
				});
		}
	}

}
