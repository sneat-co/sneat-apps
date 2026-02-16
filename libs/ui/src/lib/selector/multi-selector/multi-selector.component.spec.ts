/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '../../components';
import { OverlayController } from '../selector-base.component';
import { MultiSelectorComponent } from './multi-selector.component';
import { ISelectItem } from '../selector-interfaces';

// Suppress Ionic icon warnings - mock console methods before tests run
vi.spyOn(console, 'error').mockImplementation(() => undefined);
vi.spyOn(console, 'warn').mockImplementation(() => undefined);

describe('MultiSelectorComponent', () => {
  let component: MultiSelectorComponent;
  let fixture: ComponentFixture<MultiSelectorComponent>;

  const mockItems: ISelectItem[] = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
  ];

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectorComponent],
      providers: [
        { provide: ClassName, useValue: 'TestComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: OverlayController,
          useValue: { dismiss: vi.fn().mockResolvedValue(undefined) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(MultiSelectorComponent, {
        set: {
          imports: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [
            { provide: ClassName, useValue: 'TestComponent' },
            {
              provide: OverlayController,
              useValue: { dismiss: vi.fn().mockResolvedValue(undefined) },
            },
          ],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(MultiSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should set selectedItems when allItems changes', () => {
      component.allItems = mockItems;
      component.selectedIDs = ['1'];
      component.ngOnChanges({
        allItems: new SimpleChange(undefined, mockItems, true),
      });
      // @ts-expect-error accessing protected member
      expect(component.selectedItems).toEqual([mockItems[0]]);
    });
  });

  describe('removeItem', () => {
    it('should remove item and emit event', () => {
      component.allItems = mockItems;
      component.selectedIDs = ['1', '2'];
      component.ngOnChanges({
        allItems: new SimpleChange(undefined, mockItems, true),
      });

      const removeSpy = vi.spyOn(component.removeItems, 'emit');
      const event = { stopPropagation: vi.fn() };
      // @ts-expect-error accessing protected member
      component.removeItem(event as any, mockItems[0]);

      expect(event.stopPropagation).toHaveBeenCalled();
      // @ts-expect-error accessing protected member
      expect(component.selectedItems).toEqual([mockItems[1]]);
      expect(removeSpy).toHaveBeenCalledWith([{ event, item: mockItems[0] }]);
    });
  });
  describe('SelectorBaseComponent coverage', () => {
    it('should close and dismiss overlay', () => {
      // @ts-expect-error accessing protected member
      const dismissSpy = vi.spyOn(component.overlayController, 'dismiss');
      const event = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
      // @ts-expect-error accessing protected member
      component.close(event as any);
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(dismissSpy).toHaveBeenCalled();
    });

    it('should close without event and dismiss overlay', () => {
      // @ts-expect-error accessing protected member
      const dismissSpy = vi.spyOn(component.overlayController, 'dismiss');
      // @ts-expect-error accessing protected member
      component.close();
      expect(dismissSpy).toHaveBeenCalled();
    });

    it('should ignore ngOnChanges if allItems not changed', () => {
      // @ts-expect-error accessing protected member
      component.selectedItems = undefined;
      component.ngOnChanges({
        other: new SimpleChange(undefined, 'value', true),
      });
      // @ts-expect-error accessing protected member
      expect(component.selectedItems).toBeUndefined();
    });
  });
});
