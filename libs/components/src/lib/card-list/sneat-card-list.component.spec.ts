import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SneatCardListComponent } from './sneat-card-list.component';
import { ErrorLogger } from '@sneat/core';
import { of, throwError } from 'rxjs';

describe('SneatCardListComponent', () => {
  let component: SneatCardListComponent;
  let fixture: ComponentFixture<SneatCardListComponent>;
  let errorLogger: { logError: ReturnType<typeof vi.fn> };

  beforeEach(waitForAsync(async () => {
    errorLogger = {
      logError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SneatCardListComponent],
      providers: [
        {
          provide: ErrorLogger,
          useValue: errorLogger,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(SneatCardListComponent, {
        set: {
          imports: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SneatCardListComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit itemClick when click is called', () => {
    const itemClickSpy = vi.fn();
    component.itemClick.subscribe(itemClickSpy);

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as Event;

    const mockItem = { id: 1, title: 'Test Item' };

    component['click'](mockEvent, mockItem);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(itemClickSpy).toHaveBeenCalledWith(mockItem);
  });

  it('should change mode to add when showAddForm is called', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as Event;

    component['showAddForm'](mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component['mode']).toBe('add');
  });

  it('should successfully create item when tryCreate is called', () => {
    const mockItem = { id: '123', title: 'New Item' };
    component.items = [];
    component.create = vi.fn().mockReturnValue(of(mockItem));
    component['name'] = 'New Item';

    component['tryCreate']();

    expect(component.create).toHaveBeenCalledWith('New Item');
    expect(component.items).toContain(mockItem);
    expect(component['mode']).toBe('list');
    expect(component['name']).toBe('');
    expect(component['isAdding']).toBe(false);
  });

  it('should handle error when tryCreate fails', () => {
    const mockError = new Error('Creation failed');
    component.create = vi.fn().mockReturnValue(throwError(() => mockError));
    component['name'] = 'New Item';

    component['tryCreate']();

    expect(component.create).toHaveBeenCalledWith('New Item');
    expect(errorLogger.logError).toHaveBeenCalledWith(
      mockError,
      'Failed to create new item',
    );
    expect(component['isAdding']).toBe(false);
  });

  it('should not add item if create is not defined', () => {
    component.create = undefined;
    component['name'] = 'New Item';

    component['tryCreate']();

    expect(component['isAdding']).toBe(true);
  });

  it('should trim name before creating', () => {
    const mockItem = { id: '123', title: 'Trimmed' };
    component.items = [];
    component.create = vi.fn().mockReturnValue(of(mockItem));
    component['name'] = '  Trimmed  ';

    component['tryCreate']();

    expect(component.create).toHaveBeenCalledWith('Trimmed');
  });

  it('should initialize with default values', () => {
    expect(component.filter).toBe('');
    expect(component['mode']).toBe('list');
    expect(component['name']).toBe('');
    expect(component['isAdding']).toBeUndefined();
  });
});
