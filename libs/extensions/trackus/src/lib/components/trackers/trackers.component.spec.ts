import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AnalyticsService, ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { EMPTY } from 'rxjs';
import { TrackusSpaceService } from '../../trackus-space.service';
import { TrackusApiService } from '../../trackus-api.service';
import { TrackersComponent } from './trackers.component';

describe('TrackersComponent', () => {
  let component: TrackersComponent;
  let fixture: ComponentFixture<TrackersComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackersComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'TrackersComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        { provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
        {
          provide: TrackusSpaceService,
          useValue: { watchSpaceModuleRecord: () => EMPTY },
        },
        { provide: TrackusApiService, useValue: { archiveTracker: vi.fn() } },
      ],
    })
      .overrideComponent(TrackersComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TrackersComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
