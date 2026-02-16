import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PeriodSegmentComponent } from './period-segment.component';
import { provideAssetusMocks } from '../testing/test-utils';
import { Period } from '@sneat/dto';

describe('PeriodSegmentComponent', () => {
  let component: PeriodSegmentComponent;
  let fixture: ComponentFixture<PeriodSegmentComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodSegmentComponent],
      providers: [...provideAssetusMocks()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('segmentChanged', () => {
    it('should update period and emit changed event', () => {
      const newPeriod: Period = 'month';
      const changedSpy = vi.fn();
      component.changed.subscribe(changedSpy);

      const event = {
        detail: { value: newPeriod },
      } as CustomEvent;

      component.segmentChanged(event);

      expect(component.period).toBe(newPeriod);
      expect(changedSpy).toHaveBeenCalledWith(newPeriod);
    });

    it('should handle different period values', () => {
      const periods: Period[] = ['day', 'week', 'month', 'year'];
      const changedSpy = vi.fn();
      component.changed.subscribe(changedSpy);

      periods.forEach((period) => {
        const event = {
          detail: { value: period },
        } as CustomEvent;

        component.segmentChanged(event);

        expect(component.period).toBe(period);
      });

      expect(changedSpy).toHaveBeenCalledTimes(periods.length);
    });
  });
});
