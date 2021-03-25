import {Inject, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {IEnvDbServer, IEnvironmentSummary, IParameter} from "@sneat/datatug/models";
import {IRecordset} from "@sneat/datatug/dto";

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
	readonly title?: string;
	readonly text: string;
	readonly activeEnv?: IQueryEnvState;
	readonly environments?: IQueryEnvState[]
}

export interface IQueryEnvState {
	readonly id: string;
	readonly title?: string;
	readonly summary?: IEnvironmentSummary;
	readonly isExecuting?: boolean;
	readonly parameters?: IParameter[];
	readonly recordsets?: IRecordset[];
	readonly rowsCount?: number;
	readonly dbServerId?: string;
	readonly dbServer?: IEnvDbServer;
	readonly catalogId?: string;
	readonly error?: unknown;
}


export interface IQueryEditorState {
	readonly currentQueryId?: string;
	readonly activeQueries: IQueryState[];
}

const $state = new BehaviorSubject<IQueryEditorState | undefined>(undefined);

let counter = 0;

@Injectable({
	providedIn: 'root',
})
export class QueryEditorStateService {
	// private readonly $state = new BehaviorSubject<IQueryEditorState | undefined>(undefined);
	public readonly queryEditorState = $state.asObservable();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		console.log('QueryEditorStateService.constructor()');
	}

	openQuery(id: string): void {
		console.log(`QueryEditorStateService.openQuery(${id})`)
		try {
			let changed = false;
			let state = $state.value || {currentQueryId: id, activeQueries: []};
			let queryState = state?.activeQueries?.find(q => q.id === id)
			if (!queryState) {
				queryState = {id, text: undefined}
				state = {
					...state,
					activeQueries: [queryState, ...(state.activeQueries || [])],
				}
				changed = true;
			}
			if (state.currentQueryId !== id) {
				state = {
					...state,
					currentQueryId: id,
				};
				changed = true;
			}
			if (changed) {
				$state.next(state);
			}
		} catch (err) {
			this.errorLogger.logError(err, 'failed to openQuery');
		}
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
		$state.next({currentQueryId: queryState.id, activeQueries: $state.value?.activeQueries || [queryState]});
	}

	updateQueryState(queryState: IQueryState): void {
		console.log('updateQueryState', queryState);
		$state.next({
			...$state.value,
			activeQueries: $state.value?.activeQueries.map(q => q.id === queryState.id ? queryState : q)
		});
	}
}
