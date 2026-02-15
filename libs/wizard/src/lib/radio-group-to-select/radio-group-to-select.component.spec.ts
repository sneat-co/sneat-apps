import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonItem,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonList,
  IonLabel,
  IonListHeader,
  IonRadio,
} from '@ionic/angular/standalone';

import { RadioGroupToSelectComponent } from './radio-group-to-select.component';
import { SelectOption } from './select-options';

describe('RadioGroupToSelectComponent', () => {
  let component: RadioGroupToSelectComponent;
  let fixture: ComponentFixture<RadioGroupToSelectComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupToSelectComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(RadioGroupToSelectComponent, {
        remove: {
          imports: [
            IonItem,
            IonSelect,
            IonSelectOption,
            IonRadioGroup,
            IonList,
            IonLabel,
            IonListHeader,
            IonRadio,
          ],
        },
        add: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioGroupToSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ControlValueAccessor implementation', () => {
    it('should register onChange function', () => {
      const mockFn = vi.fn();
      component.registerOnChange(mockFn);
      
      const testValue = { test: 'value' };
      component.value = testValue;
      
      expect(mockFn).toHaveBeenCalledWith(testValue);
    });

    it('should register onTouched function', () => {
      const mockFn = vi.fn();
      component.registerOnTouched(mockFn);
      
      component.onTouched();
      
      expect(mockFn).toHaveBeenCalled();
    });

    it('should write value', () => {
      const testValue = { test: 'value' };
      component.writeValue(testValue);
      
      expect(component.value).toEqual(testValue);
    });

    it('should write undefined value', () => {
      component.writeValue(undefined);
      
      expect(component.value).toBeUndefined();
    });
  });

  describe('value getter and setter', () => {
    it('should get value', () => {
      const testValue = { test: 'value' };
      component['v'] = testValue;
      
      expect(component.value).toEqual(testValue);
    });

    it('should set value and call onChange', () => {
      const mockFn = vi.fn();
      component.registerOnChange(mockFn);
      
      const testValue = { test: 'value' };
      component.value = testValue;
      
      expect(component['v']).toEqual(testValue);
      expect(mockFn).toHaveBeenCalledWith(testValue);
    });

    it('should not call onChange when value is the same', () => {
      const mockFn = vi.fn();
      const testValue = { test: 'value' };
      component['v'] = testValue;
      component.registerOnChange(mockFn);
      
      component.value = testValue;
      
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('onValChanged', () => {
    it('should handle value change event', () => {
      const mockFn = vi.fn();
      component.registerOnChange(mockFn);
      
      const testValue = { test: 'value' };
      const mockEvent = {
        detail: { value: testValue }
      } as CustomEvent;
      
      component.onValChanged(mockEvent as unknown as Event);
      
      expect(mockFn).toHaveBeenCalledWith(testValue);
    });
  });

  describe('component inputs', () => {
    it('should set label input', () => {
      component.label = 'Test Label';
      expect(component.label).toBe('Test Label');
    });

    it('should set selectLabel input', () => {
      component.selectLabel = 'Select Label';
      expect(component.selectLabel).toBe('Select Label');
    });

    it('should set radioGroupLabel input', () => {
      component.radioGroupLabel = 'Radio Group Label';
      expect(component.radioGroupLabel).toBe('Radio Group Label');
    });

    it('should set slot input', () => {
      component.slot = 'end';
      expect(component.slot).toBe('end');
    });

    it('should default slot to start', () => {
      expect(component.slot).toBe('start');
    });

    it('should set selectOptions input', () => {
      const options: SelectOption[] = [
        { value: 'option1', title: 'Option 1' },
        { value: 'option2', title: 'Option 2' }
      ];
      component.selectOptions = options;
      expect(component.selectOptions).toEqual(options);
    });

    it('should set disabled input', () => {
      component.disabled = true;
      expect(component.disabled).toBe(true);
    });

    it('should default disabled to false', () => {
      expect(component.disabled).toBe(false);
    });
  });
});
