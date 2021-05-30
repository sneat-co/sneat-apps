import {Component, Inject} from "@angular/core";
import {QueryEditorStateService} from "./query-editor-state-service";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {IQueryState} from "@sneat/datatug/editor";

@Component({
	selector: 'datatug-queries-menu',
	templateUrl: './queries-menu.component.html',
})
export class QueriesMenuComponent {
	currentQueryId: string;

	queries: ReadonlyArray<IQueryState>;

	constructor(
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		private queryEditorStateService: QueryEditorStateService,
	) {
		this.setupQueryEditorStateTracking();
	}

	private setupQueryEditorStateTracking(): void {
		try {
			this.queryEditorStateService.queryEditorState.subscribe({
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

	selectQuery(id: string): void {
		this.queryEditorStateService.setCurrentQuery(id);
	}

	closeQuery(query: IQueryState): void {
		this.queryEditorStateService.closeQuery(query);
	}
}
