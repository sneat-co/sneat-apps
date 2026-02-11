import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserRequiredFieldsService } from '@sneat/auth-ui';
import { SneatUserService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { SpacesListComponent } from './spaces-list.component';

describe('SpacesListComponent', () => {
  let component: SpacesListComponent;
  let fixture: ComponentFixture<SpacesListComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [SpacesListComponent],
      providers: [
        { provide: ClassName, useValue: 'TestComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: SneatUserService,
          useValue: { userState: of({ record: undefined }) },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateToSpace: vi.fn() },
        },
        { provide: SpaceService, useValue: { createSpace: vi.fn() } },
        {
          provide: UserRequiredFieldsService,
          useValue: { open: vi.fn() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(SpacesListComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(SpacesListComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
