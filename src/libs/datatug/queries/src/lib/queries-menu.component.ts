import {Component, Inject} from "@angular/core";
import {IQueryState, QueryEditorStateService} from "@sneat/datatug/queries";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";

interface IQuery {
	id: string
	title?: string
}

@Component({
	selector: 'datatug-queries-menu',
	templateUrl: './queries-menu.component.html',
})
export class QueriesMenuComponent {
	tab: 'queries' | 'project' = 'queries';

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
