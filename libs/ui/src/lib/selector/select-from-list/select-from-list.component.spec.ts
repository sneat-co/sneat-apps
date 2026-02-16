import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SelectFromListComponent } from './select-from-list.component';
import { of } from 'rxjs';
import { ISelectItem } from '../selector-interfaces';

describe('SelectFromListComponent', () => {
  let component: SelectFromListComponent;
  let fixture: ComponentFixture<SelectFromListComponent>;
  let errorLoggerMock: ErrorLogger;

  const mockItems: ISelectItem[] = [
    { id: '1', title: 'Apple' },
    { id: '2', title: 'Banana', longTitle: 'Yellow Banana' },
    { id: '3', title: 'Cherry' },
  ];

  beforeEach(waitForAsync(async () => {
    errorLoggerMock = {
      logError: vi.fn(),
      logErrorHandler: vi.fn(() => vi.fn()),
    };

    await TestBed.configureTestingModule({
      imports: [SelectFromListComponent],
      providers: [{ provide: ErrorLogger, useValue: errorLoggerMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(SelectFromListComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(SelectFromListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should update items and apply filter when items change', () => {
      component.items = mockItems;
      component.ngOnChanges({
        items: new SimpleChange(undefined, mockItems, true),
      });
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()).toEqual(mockItems);
    });

    it('should subscribe to items$ and update items when items$ changes', () => {
      const items$ = of(mockItems);
      component.items$ = items$;
      component.ngOnChanges({
        items$: new SimpleChange(undefined, items$, true),
      });
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()).toEqual(mockItems);
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      component.items = mockItems;
      component.ngOnChanges({
        items: new SimpleChange(undefined, mockItems, true),
      });
    });

    it('should filter items by title', () => {
      // @ts-expect-error accessing protected member
      component.onFilterChanged(
        { detail: { value: 'app' } } as CustomEvent,
        'ionInput',
      );
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()?.length).toBe(1);
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()?.[0].id).toBe('1');
    });

    it('should filter items by longTitle', () => {
      // @ts-expect-error accessing protected member
      component.onFilterChanged(
        { detail: { value: 'yellow' } } as CustomEvent,
        'ionInput',
      );
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()?.length).toBe(1);
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()?.[0].id).toBe('2');
    });

    it('should use custom filter function if provided', () => {
      component.filterItem = (item, filter) => item.id === filter;
      // @ts-expect-error accessing protected member
      component.onFilterChanged({ detail: { value: '3' } } as CustomEvent, 'ionInput');
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()?.length).toBe(1);
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()?.[0].id).toBe('3');
    });

    it('should clear filter', () => {
      // @ts-expect-error accessing protected member
      component.onFilterChanged(
        { detail: { value: 'app' } } as CustomEvent,
        'ionInput',
      );
      // @ts-expect-error accessing protected member
      component.clearFilter();
      // @ts-expect-error accessing protected member
      expect(component.$filter()).toBe('');
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()?.length).toBe(3);
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      component.items = [
        { id: 'b', title: 'Banana' },
        { id: 'a', title: 'Apple' },
      ];
    });

    it('should sort items by title', () => {
      component.sortBy = 'title';
      component.ngOnChanges({
        items: new SimpleChange(undefined, component.items, true),
      });
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()?.[0].title).toBe('Apple');
    });

    it('should sort items by id', () => {
      component.sortBy = 'id';
      component.ngOnChanges({
        items: new SimpleChange(undefined, component.items, true),
      });
      // @ts-expect-error accessing protected member
      expect(component.$displayItems()?.[0].id).toBe('a');
    });
  });

  describe('selection', () => {
    beforeEach(() => {
      component.items = mockItems;
      component.ngOnChanges({
        items: new SimpleChange(undefined, mockItems, true),
      });
    });

    it('should select item in single mode', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      // @ts-expect-error accessing protected member
      component.select(mockItems[0]);
      // @ts-expect-error accessing protected member
      expect(component.$selectedItem()).toEqual(mockItems[0]);
      expect(onChange).toHaveBeenCalledWith('1');
    });

    it('should handle radio change in single mode', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      // @ts-expect-error accessing protected member
      component.onRadioChanged({ detail: { value: '2' } } as CustomEvent);
      expect(component.value).toBe('2');
      expect(onChange).toHaveBeenCalledWith('2');
    });

    it('should handle select change', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      component.value = '3';
      // @ts-expect-error accessing protected member
      component.onSelectChanged({} as Event);
      expect(onChange).toHaveBeenCalledWith('3');
    });

    it('should deselect item', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      // @ts-expect-error accessing protected member
      component.deselect();
      expect(component.value).toBe('');
      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('test');
      expect(component.value).toBe('test');
    });

    it('should register on change', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      // @ts-expect-error accessing protected member
      component.onChange('test');
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('should register on touched', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouched();
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      // @ts-expect-error accessing protected member
      expect(component.isDisabled).toBe(true);
    });
  });

  describe('focus', () => {
    it('should call setFocus on filterInput after timeout', fakeAsync(() => {
      const filterInputMock = {
        setFocus: vi.fn(() => Promise.resolve()),
      };
      component.filterInput = filterInputMock as unknown;
      component.focus();
      tick(100);
      expect(filterInputMock.setFocus).toHaveBeenCalled();
    }));
  });

  describe('onAdd', () => {
    it('should use current filter as value when onAdd is called', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      // @ts-expect-error accessing protected member
      component.$filter.set('New Item');
      const event = { preventDefault: vi.fn() };
      // @ts-expect-error accessing protected member
      component.onAdd(event as Event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.value).toBe('New Item');
      expect(onChange).toHaveBeenCalledWith('New Item');
    });
  });

  describe('additional coverage', () => {
    it('should ignore radio change if select mode is not single', () => {
      component.selectMode = 'multiple';
      component.value = '1';
      // @ts-expect-error accessing protected member
      component.onRadioChanged({ detail: { value: '2' } } as CustomEvent);
      expect(component.value).toBe('1');
    });

    it('should handle checkbox change', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      // @ts-expect-error accessing protected member
      component.onCheckboxChange({} as Event, mockItems[0]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'SelectFromListComponent.onCheckboxChange()',
        {},
        mockItems[0],
      );
    });

    it('should handle onChange with an ID that does not exist in items', () => {
      component.items = mockItems;
      // @ts-expect-error accessing protected member
      component.onChange('non-existent');
      // @ts-expect-error accessing protected member
      expect(component.$selectedItem()).toBeUndefined();
    });

    it('should ignore select if select mode is multiple', () => {
      component.selectMode = 'multiple';
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      // @ts-expect-error accessing protected member
      component.select(mockItems[0]);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should clear filter when selecting an item', () => {
      // @ts-expect-error accessing protected member
      component.$filter.set('app');
      // @ts-expect-error accessing protected member
      component.select(mockItems[0]);
      // @ts-expect-error accessing protected member
      expect(component.$filter()).toBe('');
    });
  });
});
