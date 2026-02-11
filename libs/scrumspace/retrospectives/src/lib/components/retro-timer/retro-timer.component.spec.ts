import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ErrorLogger } from '@sneat/core';
import { RetrospectiveService } from '../../retrospective.service';
import { TimerFactory } from '@sneat/ext-meeting';

import { RetroTimerComponent } from './retro-timer.component';

describe('RetroTimerComponent', () => {
  let component: RetroTimerComponent;
  let fixture: ComponentFixture<RetroTimerComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [RetroTimerComponent, IonicModule.forRoot()],
      providers: [
        { provide: RetrospectiveService, useValue: {} },
        { provide: ErrorLogger, useValue: { logError: vi.fn() } },
        { provide: TimerFactory, useValue: { getTimer: vi.fn() } },
      ],
    })
      .overrideComponent(RetroTimerComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RetroTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
