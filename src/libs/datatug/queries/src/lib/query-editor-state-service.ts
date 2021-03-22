import {Inject, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";

export interface IQueryState {
	readonly id: string;
	readonly title?: string;
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
			const queryState = state?.activeQueries?.find(q => q.id === id)
			if (!queryState) {
				state = {
					...state,
					activeQueries: state.activeQueries ? [{id}, ...state.activeQueries] : [{id}],
				}
				changed = true;
			}
			if (state.currentQueryId !== id) {
				state = {...state, currentQueryId: id};
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
		$state.next({
			...$state.value,
			activeQueries: $state.value?.activeQueries.map(q => q.id === queryState.id ? queryState : q)
		});
	}
}
