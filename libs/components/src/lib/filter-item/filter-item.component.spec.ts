import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FilterItemComponent } from './filter-item.component';

describe('FilterItemComponent', () => {
  let component: FilterItemComponent;
  let fixture: ComponentFixture<FilterItemComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(FilterItemComponent, {
        set: {
          imports: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          template: '',
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(FilterItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$filter', 'test');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changed event with empty string when clearFilter is called', () => {
    const changedSpy = vi.fn();
    component.changed.subscribe(changedSpy);

    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as Event;

    component['clearFilter'](mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(changedSpy).toHaveBeenCalledWith('');
  });

  it('should emit changed event when onFilterChanged is called', () => {
    const changedSpy = vi.fn();
    component.changed.subscribe(changedSpy);

    const mockEvent = {
      detail: { value: 'new filter' },
    } as CustomEvent;

    component['onFilterChanged'](mockEvent);

    expect(changedSpy).toHaveBeenCalledWith('new filter');
  });

  it('should emit empty string when onFilterChanged receives empty detail value', () => {
    const changedSpy = vi.fn();
    component.changed.subscribe(changedSpy);

    const mockEvent = {
      detail: { value: null },
    } as CustomEvent;

    component['onFilterChanged'](mockEvent);

    expect(changedSpy).toHaveBeenCalledWith('');
  });

  it('should emit blured event when onBlured is called', () => {
    const bluredSpy = vi.fn();
    component.blured.subscribe(bluredSpy);

    const mockEvent = {} as Event;

    component['onBlured'](mockEvent);

    expect(bluredSpy).toHaveBeenCalledWith(mockEvent);
  });
});
