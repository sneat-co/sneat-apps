import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { QueriesMenuComponent } from './queries-menu.component';
import { ProjectContextService } from '../services/project/project-context.service';
import { QueriesUiService } from './queries-ui.service';
import { QueryEditorStateService } from './query-editor-state-service';

describe('QueriesMenuComponent', () => {
  let component: QueriesMenuComponent;
  let fixture: ComponentFixture<QueriesMenuComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [QueriesMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        {
          provide: ProjectContextService,
          useValue: { current: undefined, current$: of(undefined) },
        },
        {
          provide: QueriesUiService,
          useValue: { openNewQuery: vi.fn() },
        },
        {
          provide: QueryEditorStateService,
          useValue: {
            queryEditorState: of(undefined),
            setCurrentQuery: vi.fn(),
            closeQuery: vi.fn(),
          },
        },
      ],
    })
      .overrideComponent(QueriesMenuComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(QueriesMenuComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
