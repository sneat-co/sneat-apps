import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { TrackusApiService } from '../../trackus-api.service';
import { TrackerFormComponent } from './tracker-form.component';

describe('TrackerFormComponent', () => {
  let component: TrackerFormComponent;
  let fixture: ComponentFixture<TrackerFormComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'TrackerFormComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: SneatAuthStateService,
          useValue: { authState: of({ user: undefined }) },
        },
        {
          provide: TrackusApiService,
          useValue: { addTrackerPoint: vi.fn() },
        },
      ],
    })
      .overrideComponent(TrackerFormComponent, {
        set: {
          imports: [],
          providers: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TrackerFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$tracker', undefined);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
