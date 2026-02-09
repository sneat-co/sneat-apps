import { TestBed } from '@angular/core/testing';
import { ActionSheetController } from '@ionic/angular/standalone';
import { RandomIdService } from '@sneat/random';
import { of } from 'rxjs';

import { QueriesUiService } from './queries-ui.service';
import { QueryEditorStateService } from './query-editor-state-service';
import { DatatugNavService } from '../services/nav/datatug-nav.service';

describe('QueriesUiService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				QueriesUiService,
				{
					provide: RandomIdService,
					useValue: { newRandomId: vi.fn(() => 'test-id') },
				},
				{
					provide: ActionSheetController,
					useValue: {
						create: vi.fn(() =>
							Promise.resolve({ present: vi.fn(), onDidDismiss: vi.fn() }),
						),
					},
				},
				{
					provide: QueryEditorStateService,
					useValue: {
						newQuery: vi.fn((qs: unknown) => qs),
						queryEditorState: of(undefined),
					},
				},
				{
					provide: DatatugNavService,
					useValue: { goQuery: vi.fn() },
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(QueriesUiService)).toBeTruthy();
	});
});
