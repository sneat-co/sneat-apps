import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { HappeningService } from '../../../../services/happening.service';
import { SinglesTabComponent } from './singles-tab.component';

describe('SinglesTabComponent', () => {
  let component: SinglesTabComponent;
  let fixture: ComponentFixture<SinglesTabComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglesTabComponent],
      providers: [
        { provide: ClassName, useValue: 'SinglesTabComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
        {
          provide: HappeningService,
          useValue: {
            watchUpcomingSingles: vi.fn(() => of([])),
            watchPastSingles: vi.fn(() => of([])),
            watchRecentlyCreatedSingles: vi.fn(() => of([])),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(SinglesTabComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(SinglesTabComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.componentRef.setInput('$contactusSpace', undefined);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
