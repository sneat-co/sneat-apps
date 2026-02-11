import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { AlertController } from '@ionic/angular/standalone';

import { BoardsPageComponent } from './boards-page.component';
import { DatatugNavContextService } from '../../../../services/nav/datatug-nav-context.service';
import { DatatugNavService } from '../../../../services/nav/datatug-nav.service';
import { DatatugBoardService } from '../../../core/datatug-board.service';
import { DatatugFoldersService } from '../../../../folders/core/datatug-folders.service';

describe('DataboardsPage', () => {
  let component: BoardsPageComponent;
  let fixture: ComponentFixture<BoardsPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardsPageComponent],
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
          provide: DatatugNavContextService,
          useValue: {
            currentProject: of(undefined),
            currentEnv: of(undefined),
            setCurrentEnvironment: vi.fn(),
          },
        },
        {
          provide: DatatugNavService,
          useValue: {
            projectPageUrl: vi.fn(),
            goBoard: vi.fn(),
            goProjPage: vi.fn(),
          },
        },
        { provide: DatatugBoardService, useValue: { createNewBoard: vi.fn() } },
        { provide: AlertController, useValue: { create: vi.fn() } },
        {
          provide: DatatugFoldersService,
          useValue: { watchFolder: vi.fn(() => of()) },
        },
      ],
    })
      .overrideComponent(BoardsPageComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BoardsPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
