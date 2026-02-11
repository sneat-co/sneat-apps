import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { TrackusApiService } from '../../trackus-api.service';
import { NewTrackerFormComponent } from './new-tracker-form.component';

describe('NewTrackerFormComponent', () => {
  let component: NewTrackerFormComponent;
  let fixture: ComponentFixture<NewTrackerFormComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTrackerFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: TrackusApiService,
          useValue: { createTracker: vi.fn() },
        },
      ],
    })
      .overrideComponent(NewTrackerFormComponent, {
        set: {
          imports: [],
          providers: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewTrackerFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('space', { id: 'test-space' });
    fixture.componentRef.setInput('category', 'fitness');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
