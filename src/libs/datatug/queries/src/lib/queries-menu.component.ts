import {Component, Inject} from "@angular/core";
// noinspection ES6PreferShortImport
import {IQueryState, QueryEditorStateService} from "./query-editor-state-service";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";

@Component({
	selector: 'datatug-queries-menu',
	templateUrl: './queries-menu.component.html',
})
export class QueriesMenuComponent {
	currentQueryId: string;

	queries: IQueryState[];

	constructor(
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		queryEditorStateService: QueryEditorStateService,
	) {
		try {
			queryEditorStateService.queryEditorState.subscribe({
				next: state => {
					console.log('QueriesMenuComponent.constructor() => QueryEditorStateService => QueryEditor state:', state);
					this.currentQueryId = state?.currentQueryId;
					this.queries = state?.activeQueries;
				},
				error: this.errorLogger.logErrorHandler('failed to get query editor stage'),
			});
		} catch (err) {
			this.errorLogger.logError(err, 'failed to subscribe for query queryEditorStateService.queryEditorState')
		}
	}

	setActiveQuery(id: string): void {
		this.currentQueryId = id;
	}
}
