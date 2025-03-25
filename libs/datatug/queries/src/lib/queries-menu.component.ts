import { Component, Inject } from '@angular/core';
import { QueryEditorStateService } from './query-editor-state-service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IQueryState } from '@sneat/ext-datatug-editor';
import { QueriesUiService } from './queries-ui.service';
import { ProjectContextService } from '@sneat/ext-datatug-services-project';

@Component({
	selector: 'sneat-datatug-queries-menu',
	templateUrl: './queries-menu.component.html',
	standalone: false,
})
export class QueriesMenuComponent {
	tab: 'active' | 'all' | 'bookmarked' = 'all';

	currentQueryId?: string;

	queries?: ReadonlyArray<IQueryState>;

	public trackByID = (i: number, item: IQueryState) => item.id;

	constructor(
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		private readonly projectContextService: ProjectContextService,
		private readonly queriesUiService: QueriesUiService,
		private readonly queryEditorStateService: QueryEditorStateService,
	) {
		this.setupQueryEditorStateTracking();
	}

	private setupQueryEditorStateTracking(): void {
		try {
			this.queryEditorStateService.queryEditorState.subscribe({
				next: (state) => {
					console.log(
						'QueriesMenuComponent.constructor() => QueryEditorStateService => QueryEditor state:',
						state,
					);
					this.currentQueryId = state?.currentQueryId;
					this.queries = state?.activeQueries;
				},
				error: this.errorLogger.logErrorHandler(
					'failed to get query editor stage',
				),
			});
		} catch (err) {
			this.errorLogger.logError(
				err,
				'failed to subscribe for query queryEditorStateService.queryEditorState',
			);
		}
	}

	selectQuery(id?: string): void {
		if (id) {
			this.queryEditorStateService.setCurrentQuery(id);
		}
	}

	closeQuery(query: IQueryState): void {
		this.queryEditorStateService.closeQuery(query);
	}

	newQuery(): void {
		if (!this.projectContextService.current) {
			alert('Current project context is not in ProjectContextService');
			return;
		}
		this.queriesUiService
			.openNewQuery(this.projectContextService.current)
			.catch(this.errorLogger.logErrorHandler('failed to open new query'));
	}
}
