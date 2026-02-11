import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { TrackusApiService } from '../../trackus-api.service';
import { TrackerHistoryComponent } from './tracker-history.component';

describe('TrackerHistoryComponent', () => {
  let component: TrackerHistoryComponent;
  let fixture: ComponentFixture<TrackerHistoryComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'TrackerHistoryComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: TrackusApiService,
          useValue: { deleteTrackerPoints: vi.fn() },
        },
      ],
    })
      .overrideComponent(TrackerHistoryComponent, {
        set: {
          imports: [],
          providers: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TrackerHistoryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$tracker', undefined);
    fixture.componentRef.setInput('$contactusSpace', undefined);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
