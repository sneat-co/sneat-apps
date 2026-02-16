import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { DateModalComponent } from './date-modal.component';

describe('DateModalComponent', () => {
  let component: DateModalComponent;
  let fixture: ComponentFixture<DateModalComponent>;
  let popoverController: { dismiss: ReturnType<typeof vi.fn> };
  let errorLogger: { logError: ReturnType<typeof vi.fn>; logErrorHandler: ReturnType<typeof vi.fn> };

  beforeEach(waitForAsync(async () => {
    popoverController = {
      dismiss: vi.fn().mockResolvedValue(true),
    };

    errorLogger = {
      logError: vi.fn(),
      logErrorHandler: vi.fn().mockReturnValue(() => {}),
    };

    await TestBed.configureTestingModule({
      imports: [DateModalComponent],
      providers: [
        { provide: ClassName, useValue: 'TestComponent' },
        { provide: ErrorLogger, useValue: errorLogger },
        { provide: PopoverController, useValue: popoverController },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DateModalComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DateModalComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with undefined date', () => {
    expect(component['$date']()).toBeUndefined();
  });

  it('should set date when onDateChanged is called with valid date', () => {
    const mockEvent = {
      detail: { value: '2024-03-15T10:30:00.000Z' },
    } as CustomEvent;

    component['onDateChanged'](mockEvent);

    expect(component['$date']()).toBe('2024-03-15');
  });

  it('should handle date change with already formatted date', () => {
    const mockEvent = {
      detail: { value: '2024-12-25' },
    } as CustomEvent;

    component['onDateChanged'](mockEvent);

    expect(component['$date']()).toBe('2024-12-25');
  });

  it('should set null when onDateChanged receives empty value', () => {
    const mockEvent = {
      detail: { value: null },
    } as CustomEvent;

    component['onDateChanged'](mockEvent);

    expect(component['$date']()).toBeNull();
  });

  it('should dismiss popover with current date', () => {
    component['$date'].set('2024-06-10');

    component['dismiss']();

    expect(popoverController.dismiss).toHaveBeenCalledWith('2024-06-10');
  });

  it('should dismiss popover with undefined date', () => {
    component['dismiss']();

    expect(popoverController.dismiss).toHaveBeenCalledWith(undefined);
  });

  it('should handle dismiss error', async () => {
    const mockError = new Error('Dismiss failed');
    popoverController.dismiss = vi.fn().mockRejectedValue(mockError);
    const errorHandler = vi.fn();
    errorLogger.logErrorHandler = vi.fn().mockReturnValue(errorHandler);

    component['dismiss']();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(errorLogger.logErrorHandler).toHaveBeenCalledWith('failed to dismiss date modal');
  });
});
