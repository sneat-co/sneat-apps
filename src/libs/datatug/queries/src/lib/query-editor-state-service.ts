import {Inject, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";

export interface IQueryState {
	id: string;
	title?: string;
}

export interface IQueryEditorState {
	readonly currentQueryId?: string;
	readonly activeQueries: IQueryState[];
}

const $state = new BehaviorSubject<IQueryEditorState | undefined>(undefined);

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
			const queryState = state.activeQueries.find(q => q.id === id)
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
}
