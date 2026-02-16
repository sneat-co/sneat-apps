import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { IQueryState } from '../editor/models';
import { ProjectContextService } from '../services/project/project-context.service';
import { QueryEditorStateService } from './query-editor-state-service';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { QueriesUiService } from './queries-ui.service';

@Component({
  selector: 'sneat-datatug-queries-menu',
  templateUrl: './queries-menu.component.html',
  imports: [
    IonSegment,
    IonSegmentButton,
    IonItem,
    IonIcon,
    IonInput,
    IonButtons,
    IonButton,
    IonLabel,
    FormsModule,
  ],
})
export class QueriesMenuComponent {
  readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly projectContextService = inject(ProjectContextService);
  private readonly queriesUiService = inject(QueriesUiService);
  private readonly queryEditorStateService = inject(QueryEditorStateService);

  tab: 'active' | 'all' | 'bookmarked' = 'all';

  currentQueryId?: string;

  queries?: ReadonlyArray<IQueryState>;

  constructor() {
    this.setupQueryEditorStateTracking();
  }

  private setupQueryEditorStateTracking(): void {
    try {
      this.queryEditorStateService.queryEditorState.subscribe({
        next: (state) => {
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
