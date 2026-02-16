import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { InlistOptionsComponent, Option } from './inlist-options.component';

describe('InlistOptionsComponent', () => {
  let component: InlistOptionsComponent;
  let fixture: ComponentFixture<InlistOptionsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [InlistOptionsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(InlistOptionsComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlistOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onOptionSelected', () => {
    it('should stop propagation and prevent default on event', () => {
      const mockEvent = new Event('click');
      const stopPropagationSpy = vi.spyOn(mockEvent, 'stopPropagation');
      const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
      const option: Option = { id: 'option-1', title: 'Test Option' };

      component['onOptionSelected'](mockEvent, option);

      expect(stopPropagationSpy).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should set selectedOption to the provided option', () => {
      const mockEvent = new Event('click');
      const option: Option = { id: 'option-1', title: 'Test Option' };

      component['onOptionSelected'](mockEvent, option);

      expect(component.selectedOption).toBe(option);
    });

    it('should emit optionSelected event with uiEvent and option', () => {
      const mockEvent = new Event('click');
      const option: Option = { id: 'option-1', title: 'Test Option' };
      
      vi.spyOn(component.optionSelected, 'emit');

      component['onOptionSelected'](mockEvent, option);

      expect(component.optionSelected.emit).toHaveBeenCalledWith({
        uiEvent: mockEvent,
        option: option,
      });
    });

    it('should work with option without title', () => {
      const mockEvent = new Event('click');
      const option: Option = { id: 'option-2' };

      vi.spyOn(component.optionSelected, 'emit');

      component['onOptionSelected'](mockEvent, option);

      expect(component.selectedOption).toBe(option);
      expect(component.optionSelected.emit).toHaveBeenCalledWith({
        uiEvent: mockEvent,
        option: option,
      });
    });

    it('should handle multiple option selections', () => {
      const option1: Option = { id: 'option-1', title: 'Option 1' };
      const option2: Option = { id: 'option-2', title: 'Option 2' };
      const mockEvent1 = new Event('click');
      const mockEvent2 = new Event('click');

      component['onOptionSelected'](mockEvent1, option1);
      expect(component.selectedOption).toBe(option1);

      component['onOptionSelected'](mockEvent2, option2);
      expect(component.selectedOption).toBe(option2);
    });
  });
});
