import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { CalendarNavService } from '../../../../services';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { of } from 'rxjs';
import { ClassName } from '@sneat/ui';

import { DaySlotItemComponent } from './day-slot-item.component';

describe('ActivityItemComponent', () => {
  let component: DaySlotItemComponent;
  let fixture: ComponentFixture<DaySlotItemComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [DaySlotItemComponent],
      providers: [
        { provide: PopoverController, useValue: {} },
        { provide: CalendarNavService, useValue: {} },
      ],
    })
      .overrideComponent(DaySlotItemComponent, {
        set: {
          providers: [
            { provide: ClassName, useValue: 'DaySlotItemComponent' },
            {
              provide: ContactusSpaceService,
              useValue: { watchContactBriefs: () => of([]) },
            },
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaySlotItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$slotContext', {
      slot: { id: 'test-slot' },
      timing: { start: { time: '10:00' } },
      happening: { id: 'test-happening', space: { id: 'test-space' } },
      title: 'Test Slot',
      repeats: 'weekly',
    });
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
