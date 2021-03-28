import {Inject, Injectable} from "@angular/core";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {IEnvDbServer, IEnvironmentSummary, IParameter, IProjDbModelBrief, IQueryDef} from "@sneat/datatug/models";
import {IExecuteResponse, IRecordset} from "@sneat/datatug/dto";
import {QueriesService} from "./queries.service";
import {IDatatugProjRef} from "@sneat/datatug/core";
import {DatatugNavContextService} from "@sneat/datatug/services/nav";
import {filter} from "rxjs/operators";
import {IDatatugProjectContext} from "@sneat/datatug/nav";

export interface ISqlQueryTarget {
	repository: string; // Should be removed?
	project: string;	// Should be removed?
	model?: string;
	driver?: string;
	server?: string;
	catalog?: string;
}


export interface IQueryState {
	readonly id: string;
	readonly isNew?: boolean;
	readonly def?: IQueryDef;
	readonly title?: string;
	readonly text: string;
	readonly targetDbModel?: IProjDbModelBrief;
	readonly activeEnv?: IQueryEnvState;
	readonly environments?: ReadonlyArray<IQueryEnvState>;
	readonly response?: IExecuteResponse;
	readonly isSaving?: boolean;
	readonly isLoading?: boolean;
}

export const isQueryChanged = (queryState: IQueryState): boolean => {
	const {def} = queryState;
	return !def
		|| def.text != queryState.text
		|| def.title != queryState.title
		|| def.dbModel != queryState.targetDbModel?.id;
}

export interface IQueryEnvState {
	readonly id: string;
	readonly title?: string;
	readonly summary?: IEnvironmentSummary;
	readonly isExecuting?: boolean;
	readonly parameters?: ReadonlyArray<IParameter>;
	readonly recordsets?: ReadonlyArray<IRecordset>;
	readonly rowsCount?: number;
	readonly dbServerId?: string;
	readonly dbServer?: IEnvDbServer;
	readonly catalogId?: string;
	readonly error?: unknown;
}


export interface IQueryEditorState {
	readonly currentQueryId?: string;
	readonly activeQueries: ReadonlyArray<IQueryState>;
}

const $state = new BehaviorSubject<IQueryEditorState>(undefined);

let counter = 0;

@Injectable({
	providedIn: 'root',
})
export class QueryEditorStateService {
	public readonly queryEditorState = $state.asObservable().pipe(filter(state => !!state));

	private currentProject: IDatatugProjectContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly queriesService: QueriesService,
		readonly datatugNavContextService: DatatugNavContextService,
	) {
		console.log('QueryEditorStateService.constructor()');
		datatugNavContextService.currentProject
			.subscribe(currentProject => {
				this.currentProject = currentProject;
				if (this.currentProject?.summary) {
					$state.next(this.updateQuerySatesWithProj($state.value || {activeQueries: []}));
				}
			});
	}

	public getQueryState(id: string): IQueryState {
		return $state.value.activeQueries.find(qs => qs.id === id);
	}


	openQuery(id: string): void {
		console.log(`QueryEditorStateService.openQuery(${id})`, this.currentProject);
		try {
			let changed = false;
			let state = $state.value || {currentQueryId: id, activeQueries: []};
			let queryState = state?.activeQueries?.find(q => q.id === id)
			if (!queryState) {
				queryState = {
					id,
					text: undefined,
					isLoading: true,
				}
				state = {
					...state,
					activeQueries: [queryState, ...(state.activeQueries || [])],
				}
				changed = true;
				this.loadQuery(id);
			}
			if (state.currentQueryId !== id) {
				state = {
					...state,
					currentQueryId: id,
				};
				changed = true;
			}
			if (changed) {
				$state.next(this.updateQueryStatesWithEnvs(state));
			}
		} catch (err) {
			this.errorLogger.logError(err, 'failed to openQuery');
		}
	}

	private loadQuery(id: string): void {
		console.log('loadQuery', id);
		const onCompleted = (def: IQueryDef, error?: any) => {
			let state: IQueryState = {
				...$state.value.activeQueries.find(q => q.id === id),
				isLoading: false,
			};
			if (def) {
				state = {...state, def};
			}
			if (state.text === undefined) {
				state = {...state, text: def.text};
			}
			if (state.title === undefined) {
				state = {...state, title: def.title};
			}
			state = this.updateQueryStateWithEnvs(state);
			if (!state.targetDbModel) {
				state =  {
					...state,
					targetDbModel: def.dbModel
						? this.currentProject?.summary?.dbModels.find(m => m.id === def.dbModel)
						: this.currentProject?.summary?.dbModels?.length === 1 ? this.currentProject?.summary?.dbModels[0] : undefined,
				};
			}
			this.updateQueryState(state);
		};
		this.queriesService.getQuery(this.currentProject, id).subscribe({
			next: def => onCompleted(def),
			error: err => onCompleted(undefined, err),
		});
	}

	public newQuery(queryState: IQueryState): void {
		if (!queryState.title) {
			for (; ;) {
				counter += 1;
				const title = `Query #${counter}`;
				if (!$state.value?.activeQueries?.find(q => q.title === title)) {
					queryState = {...queryState, title};
					break;
				}
			}
		}
		queryState = this.updateQueryStateWithEnvs(queryState);
		const state: IQueryEditorState = {
			currentQueryId: queryState.id,
			activeQueries: [...$state.value?.activeQueries, queryState] || [queryState],
		};
		$state.next(state);
	}

	private updateQuerySatesWithProj(state: IQueryEditorState): IQueryEditorState {
		console.log('updateQuerySatesWithProj', state);
		state = this.updateQueryStatesWithEnvs(state);
		const projDbModels = this.currentProject.summary?.dbModels;
		if (projDbModels?.length === 1) {
			state = {
				...state,
				activeQueries: state.activeQueries.map(
					q => q.def && !q.def.dbModel ? {...q, targetDbModel: projDbModels[0]} : q,
				),
			};
		}
		return state;
	}

	private updateQueryStatesWithEnvs(state: IQueryEditorState): IQueryEditorState {
		console.log('updateQueryStatesWithEnvs', state.activeQueries, this.currentProject?.summary?.environments);
		const {activeQueries} = state;
		if (!activeQueries?.length) {
			return state;
		}
		state = {
			...state,
			activeQueries: activeQueries.map(this.updateQueryStateWithEnvs),
		};
		return state;
	}

	private readonly updateQueryStateWithEnvs = (queryState: IQueryState): IQueryState => ({
		...queryState,
		environments: this.currentProject?.summary?.environments?.map(env => {
				const qEnv = queryState.environments?.find(qEnv => qEnv.id === env.id);
				if (!qEnv) {
					return env;
				}
				return qEnv;
			})
			?? queryState.environments,
	});

	updateQueryState(queryState: IQueryState): void {
		console.log('updateQueryState', queryState);
		$state.next({
			...$state.value,
			activeQueries: $state.value?.activeQueries.map(q => q.id === queryState.id ? queryState : q)
		});
	}

	saveQuery(queryState: IQueryState, target: IDatatugProjRef): Observable<void> {
		if (target.projectId !== this.currentProject.projectId) {
			return throwError('An attempt to save a query after current project have been changed');
		}
		const {id} = queryState;
		const setIsSavingToFalse = () => {
			const state = this.getQueryState(id);
			if (state.isSaving) {
				this.updateQueryState({
					...state,
					isSaving: false,
				});
			}
		}
		try {
			this.updateQueryState({
				...queryState,
				isSaving: true,
			});
			const query: IQueryDef = {
				...queryState.def,
				text: queryState.text,
			};
			this.queriesService.updateQuery(target, query)
				.subscribe({
					next: value => {
						console.log('query updated', value);
						this.updateQueryState({
							...this.getQueryState(query.id),
							def: value,
						})
						setIsSavingToFalse();
					},
					error: err => {
						setIsSavingToFalse();
						this.errorLogger.logError(err, 'Failed to save query');
					},
				});
		} catch (e) {
			setIsSavingToFalse();
			return throwError(e);
		}
	}
}
