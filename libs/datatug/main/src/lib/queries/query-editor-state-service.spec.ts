import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { QueryEditorStateService } from './query-editor-state-service';
import { QueriesService } from './queries.service';
import { DatatugNavContextService } from '../services/nav/datatug-nav-context.service';

describe('QueryEditorStateService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				QueryEditorStateService,
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: QueriesService,
					useValue: { getQuery: vi.fn(), updateQuery: vi.fn() },
				},
				{
					provide: DatatugNavContextService,
					useValue: {
						currentProject: of(undefined),
						currentEnv: of(undefined),
					},
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(QueryEditorStateService)).toBeTruthy();
	});
});
