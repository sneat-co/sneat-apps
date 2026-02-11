import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SneatAuthStateService } from '@sneat/auth-core';
import { of } from 'rxjs';

import { MyDatatugProjectsComponent } from './my-datatug-projects.component';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';
import { DatatugUserService } from '../../../services/base/datatug-user-service';
import { NewProjectService } from '../../../project/new-project/new-project.service';

describe('MyProjectsComponent', () => {
  let component: MyDatatugProjectsComponent;
  let fixture: ComponentFixture<MyDatatugProjectsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDatatugProjectsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        { provide: DatatugNavService, useValue: { goProject: vi.fn() } },
        {
          provide: SneatAuthStateService,
          useValue: {
            authState: of({ status: undefined }),
            authStatus: of(undefined),
          },
        },
        {
          provide: DatatugUserService,
          useValue: {
            datatugUserState: of({ status: undefined, record: null }),
          },
        },
        {
          provide: NewProjectService,
          useValue: { openNewProjectDialog: vi.fn() },
        },
      ],
    })
      .overrideComponent(MyDatatugProjectsComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MyDatatugProjectsComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
