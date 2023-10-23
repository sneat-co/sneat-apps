import { Inject, Injectable } from '@angular/core';
import {
	BehaviorSubject,
	catchError,
	map,
	Observable,
	tap,
	throwError,
} from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IHttpQueryRequest,
	IQueryDef,
	ISqlQueryRequest,
	QueryType,
} from '@sneat/datatug-models';
import { QueriesService } from './queries.service';
import { IProjectRef } from '@sneat/datatug-core';
import { DatatugNavContextService } from '@sneat/datatug-services-nav';
import { IProjectContext } from '@sneat/datatug/nav';
import { filter } from 'rxjs/operators';
import { IQueryEditorState, IQueryState } from '@sneat/datatug/editor';

export const isQueryChanged = (queryState: IQueryState): boolean => {
	if (!queryState) {
		return false;
	}
	const { def } = queryState;
	if (!def || def.title != queryState.title) {
		return true;
	}
	if (def.request.queryType !== queryState.request?.queryType) {
		throw new Error(
			`def.request.type !== queryState.request.type: ${def.request.queryType} !== ${queryState.request?.queryType}`,
		);
	}
	switch (queryState?.request?.queryType) {
		case QueryType.SQL:
			return (
				(queryState.request as ISqlQueryRequest).text !=
				(def.request as ISqlQueryRequest).text
			);
		case QueryType.HTTP:
			return (
				(queryState.request as IHttpQueryRequest).url !=
				(def.request as IHttpQueryRequest).url
			);
		default:
			throw new Error(
				'Unknown query request type: ' + queryState.request.queryType,
			);
	}
};

const $state = new BehaviorSubject<IQueryEditorState | undefined>(undefined);

let counter = 0;

@Injectable()
export class QueryEditorStateService {
	public readonly queryEditorState = $state
		.asObservable()
		.pipe(filter((state) => !!state));

	private currentProject?: IProjectContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly queriesService: QueriesService,
		readonly datatugNavContextService: DatatugNavContextService,
	) {
		console.log('QueryEditorStateService.constructor()');
		datatugNavContextService.currentProject.subscribe((currentProject) => {
			this.currentProject = currentProject;
			if (this.currentProject?.summary) {
				$state.next(
					this.updateQuerySatesWithProj($state.value || { activeQueries: [] }),
				);
			}
		});
	}

	public getQueryState(id: string): IQueryState | undefined {
		return $state.value?.activeQueries.find((qs) => qs.id === id);
	}

	public setCurrentQuery(id: string): void {
		const newState: IQueryEditorState = $state.value
			? {
					...$state.value,
					currentQueryId: id,
			  }
			: { currentQueryId: id, activeQueries: [] };
		$state.next(newState);
	}

	public closeQuery(query: IQueryState): void {
		const newState: IQueryEditorState = {
			...$state.value,
			activeQueries:
				$state.value?.activeQueries.filter((q) => q !== query) ?? [],
		};
		$state.next(newState);
	}

	openQuery(id: string): void {
		console.log(
			`QueryEditorStateService.openQuery(${id})`,
			this.currentProject,
		);
		try {
			let changed = false;
			let state: IQueryEditorState = $state.value || {
				currentQueryId: id,
				activeQueries: [],
			};
			let queryState = state?.activeQueries?.find((q) => q.id === id);
			if (!queryState) {
				queryState = {
					id,
					queryType: QueryType.SQL,
					request: {
						queryType: QueryType.SQL,
						text: '',
					} as ISqlQueryRequest,
					isLoading: true,
				};
				state = {
					...state,
					activeQueries: [queryState, ...(state.activeQueries || [])],
				};
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
		const onCompleted = (def?: IQueryDef, error?: unknown) => {
			console.log('loadQuery.onCompleted', def, error);
			const activeQuery = $state.value?.activeQueries.find((q) => q.id === id);
			if (!activeQuery) {
				return;
			}
			let state: IQueryState = {
				...activeQuery,
				isLoading: false,
			};
			if (def) {
				state = { ...state, def };
			}
			if (
				state.request?.queryType === QueryType.SQL &&
				(state.request as ISqlQueryRequest).text === undefined
			) {
				state = { ...state, request: def?.request };
			}
			if (state.title === undefined) {
				state = { ...state, title: def?.title };
			}
			state = this.updateQueryStateWithEnvs(state);
			if (!state.targetDbModel) {
				state = {
					...state,
					targetDbModel: def?.dbModel
						? this.currentProject?.summary?.dbModels?.find(
								(m) => m.id === def.dbModel,
						  )
						: this.currentProject?.summary?.dbModels?.length === 1
						? this.currentProject?.summary?.dbModels[0]
						: undefined,
				};
			}
			this.updateQueryState(state);
		};
		if (this.currentProject) {
			this.queriesService.getQuery(this.currentProject.ref, id).subscribe({
				next: (def) => onCompleted(def),
				error: (err) => onCompleted(undefined, err),
			});
		}
	}

	public newQuery(queryState: IQueryState): IQueryState {
		if (!queryState.title) {
			for (;;) {
				counter += 1;
				const title = `Query #${counter}`;
				if (!$state.value?.activeQueries?.find((q) => q.title === title)) {
					queryState = { ...queryState, title };
					break;
				}
			}
		}
		queryState = this.updateQueryStateWithEnvs(queryState);
		if ($state.value) {
			const state: IQueryEditorState = {
				currentQueryId: queryState.id,
				activeQueries: [...$state.value.activeQueries, queryState] || [
					queryState,
				],
			};
			$state.next(state);
		}
		return queryState;
	}

	private updateQuerySatesWithProj(
		state: IQueryEditorState,
	): IQueryEditorState {
		console.log('updateQuerySatesWithProj', state);
		state = this.updateQueryStatesWithEnvs(state);
		if (!this.currentProject) {
			return state;
		}
		const projDbModels = this.currentProject.summary?.dbModels;
		if (projDbModels?.length === 1) {
			state = {
				...state,
				activeQueries: state.activeQueries.map((q) =>
					q.def && !q.def.dbModel
						? { ...q, targetDbModel: projDbModels[0] }
						: q,
				),
			};
		}
		return state;
	}

	private updateQueryStatesWithEnvs(
		state: IQueryEditorState,
	): IQueryEditorState {
		console.log(
			'updateQueryStatesWithEnvs',
			state.activeQueries,
			this.currentProject?.summary?.environments,
		);
		const { activeQueries } = state;
		if (!activeQueries?.length) {
			return state;
		}
		state = {
			...state,
			activeQueries: activeQueries.map(this.updateQueryStateWithEnvs),
		};
		return state;
	}

	private readonly updateQueryStateWithEnvs = (
		queryState: IQueryState,
	): IQueryState => ({
		...queryState,
		environments:
			this.currentProject?.summary?.environments?.map((env) => {
				const qEnv = queryState.environments?.find(
					(qEnv) => qEnv.id === env.id,
				);
				if (!qEnv) {
					return env;
				}
				return qEnv;
			}) ?? queryState.environments,
	});

	updateQueryState(queryState: IQueryState): void {
		console.log('updateQueryState', queryState);
		if (!$state.value) {
			return;
		}
		$state.next({
			...$state.value,
			activeQueries: $state.value?.activeQueries.map((q) =>
				q.id === queryState.id ? queryState : q,
			),
		});
	}

	saveQuery(
		queryState: IQueryState,
		projectRef: IProjectRef,
	): Observable<void> {
		if (!this.currentProject) {
			return throwError(() => 'no current project');
		}
		if (projectRef.projectId !== this.currentProject.ref.projectId) {
			return throwError(
				() =>
					'An attempt to save a query after current project have been changed',
			);
		}
		const { id } = queryState;
		if (!id) {
			return throwError(() => 'queryState.id is not set');
		}
		const setIsSavingToFalse = () => {
			const state = this.getQueryState(id);
			if (!state) {
				return;
			}
			if (state.isSaving) {
				this.updateQueryState({
					...state,
					isSaving: false,
				});
			}
		};
		try {
			this.updateQueryState({
				...queryState,
				isSaving: true,
			});
			if (!queryState.request) {
				return throwError(() => 'query state has no request');
			}
			if (!queryState.def?.id) {
				return throwError(() => `queryState.def.id is not defined`);
			}
			const query: IQueryDef = {
				...queryState.def,
				request: queryState.request,
			};
			const result = this.queriesService.updateQuery(projectRef, query).pipe(
				tap((value: IQueryDef) => {
					console.log('query updated', value);
					const queryState = this.getQueryState(query.id);
					if (!queryState) {
						return throwError(() => `no state for query with id=${query.id}`);
					}
					this.updateQueryState({
						...queryState,
						def: value,
					});
					setIsSavingToFalse();
					return value;
				}),
				catchError((err) => {
					setIsSavingToFalse();
					this.errorLogger.logError(err, 'Failed to save query');
					throw err;
				}),
				map(() => void 0),
			);
			return result;
		} catch (e) {
			setIsSavingToFalse();
			return throwError(e);
		}
	}
}
