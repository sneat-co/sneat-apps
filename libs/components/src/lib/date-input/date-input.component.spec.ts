import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { DateInputComponent } from './date-input.component';

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let fixture: ComponentFixture<DateInputComponent>;
  let popoverController: {
    create: ReturnType<typeof vi.fn>;
  };

  beforeEach(waitForAsync(async () => {
    popoverController = {
      create: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DateInputComponent],
      providers: [
        { provide: PopoverController, useValue: popoverController },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DateInputComponent, {
        set: {
          imports: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
          template: '',
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DateInputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$label', 'Test Label');
    fixture.componentRef.setInput('$value', '2024-01-01');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with undefined newValue', () => {
    expect(component.$newValue()).toBeUndefined();
  });

  it('should compute noValueText with default when noValueLabel is not set', () => {
    expect(component['$noValueText']()).toBe('(not set)');
  });

  it('should compute noValueText with custom label when provided', () => {
    fixture.componentRef.setInput('$noValueLabel', 'Custom Label');
    expect(component['$noValueText']()).toBe('Custom Label');
  });

  it('should compute displayValue from value when not updating', () => {
    fixture.componentRef.setInput('$updating', false);
    expect(component.$displayValue()).toBe('2024-01-01');
  });

  it('should compute displayValue from newValue when updating', () => {
    component.$newValue.set('2024-12-31');
    fixture.componentRef.setInput('$updating', true);
    expect(component.$displayValue()).toBe('2024-12-31');
  });

  it('should update newValue when onValueChanged is called', () => {
    const mockEvent = {
      detail: { value: '2024-06-15' },
    } as CustomEvent;

    component['onValueChanged'](mockEvent);

    expect(component.$newValue()).toBe('2024-06-15');
  });

  it('should emit valueChange when save is called', () => {
    const emitSpy = vi.fn();
    component.valueChange.subscribe(emitSpy);
    component.$newValue.set('2024-03-20');

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as Event;

    component['save'](mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('2024-03-20');
  });

  it('should open date picker and handle date selection', async () => {
    const mockPopover = {
      onDidDismiss: vi.fn().mockResolvedValue({
        data: '2024-09-01',
      }),
      present: vi.fn().mockResolvedValue(undefined),
    };

    popoverController.create.mockResolvedValue(mockPopover);

    const emitSpy = vi.fn();
    component.valueChange.subscribe(emitSpy);

    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as Event;

    await component['openDatePicker'](mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(popoverController.create).toHaveBeenCalledWith({
      reference: 'trigger',
      event: mockEvent,
      side: 'bottom',
      alignment: 'center',
      component: expect.anything(),
      componentProps: {
        title: 'Test Label',
        max: undefined,
      },
    });
    expect(mockPopover.present).toHaveBeenCalled();
    expect(component.$newValue()).toBe('2024-09-01');
    expect(emitSpy).toHaveBeenCalledWith('2024-09-01');
  });

  it('should handle empty date selection in date picker', async () => {
    const mockPopover = {
      onDidDismiss: vi.fn().mockResolvedValue({
        data: '',
      }),
      present: vi.fn().mockResolvedValue(undefined),
    };

    popoverController.create.mockResolvedValue(mockPopover);

    const emitSpy = vi.fn();
    component.valueChange.subscribe(emitSpy);

    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as Event;

    await component['openDatePicker'](mockEvent);

    expect(component.$newValue()).toBe('');
    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('should not emit when date picker is cancelled', async () => {
    const mockPopover = {
      onDidDismiss: vi.fn().mockResolvedValue({
        data: undefined,
      }),
      present: vi.fn().mockResolvedValue(undefined),
    };

    popoverController.create.mockResolvedValue(mockPopover);

    const emitSpy = vi.fn();
    component.valueChange.subscribe(emitSpy);

    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as Event;

    await component['openDatePicker'](mockEvent);

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
