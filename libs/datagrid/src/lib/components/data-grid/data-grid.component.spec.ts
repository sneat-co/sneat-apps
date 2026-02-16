import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SimpleChange } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { vi } from 'vitest';

import { DataGridComponent } from './data-grid.component';
import { IGridColumn } from '@sneat/grid';

describe('DataGridComponent', () => {
  let component: DataGridComponent;
  let fixture: ComponentFixture<DataGridComponent>;
  let mockErrorLogger: {
    logError: ReturnType<typeof vi.fn>;
    logErrorHandler: ReturnType<typeof vi.fn>;
  };

  beforeEach(waitForAsync(async () => {
    // Create mock error logger
    mockErrorLogger = {
      logError: vi.fn(),
      logErrorHandler: vi.fn().mockReturnValue((err: unknown) => {
        console.error('Error handler:', err);
      }),
    };

    await TestBed.configureTestingModule({
      imports: [DataGridComponent, IonicModule.forRoot()],
      providers: [{ provide: ErrorLogger, useValue: mockErrorLogger }],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have default layout as fitColumns', () => {
      expect(component.layout).toBe('fitColumns');
    });

    it('should initialize data as empty array', () => {
      expect(component.data).toEqual([]);
    });

    it('should initialize columns as empty array', () => {
      expect(component.columns).toEqual([]);
    });

    it('should accept custom layout input', () => {
      component.layout = 'fitData';
      expect(component.layout).toBe('fitData');
    });

    it('should accept selectable input', () => {
      component.selectable = true;
      expect(component.selectable).toBe(true);
    });

    it('should accept numeric selectable input', () => {
      component.selectable = 5;
      expect(component.selectable).toBe(5);
    });

    it('should accept highlight selectable input', () => {
      component.selectable = 'highlight';
      expect(component.selectable).toBe('highlight');
    });
  });

  describe('ngOnChanges', () => {
    it('should handle data changes when both data and columns are present', () => {
      const mockColumns: IGridColumn[] = [
        { field: 'id', title: 'ID', dbType: 'int' },
        { field: 'name', title: 'Name', dbType: 'string' },
      ];
      const mockData = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' },
      ];

      component.columns = mockColumns;
      component.data = mockData;

      vi.spyOn<any, any>(component, 'drawTable');

      component.ngOnChanges({
        data: new SimpleChange(null, mockData, false),
      });

      expect((component as any).drawTable).toHaveBeenCalled();
    });

    it('should handle columns changes', () => {
      const mockColumns: IGridColumn[] = [
        { field: 'id', title: 'ID', dbType: 'int' },
      ];

      component.data = [{ id: 1 }];
      component.columns = mockColumns;

      vi.spyOn<any, any>(component, 'drawTable');

      component.ngOnChanges({
        columns: new SimpleChange(null, mockColumns, false),
      });

      expect((component as any).drawTable).toHaveBeenCalled();
    });

    it('should handle rowClick changes', () => {
      const mockRowClick = (event: Event, row: unknown) => {
        console.log('row clicked', event, row);
      };

      component.rowClick = mockRowClick;
      component.data = [{ id: 1 }];
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];

      vi.spyOn<any, any>(component, 'drawTable');

      component.ngOnChanges({
        rowClick: new SimpleChange(null, mockRowClick, false),
      });

      expect((component as any).drawTable).toHaveBeenCalled();
    });

    it('should not call drawTable if data is missing', () => {
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = undefined;

      vi.spyOn<any, any>(component, 'drawTable');

      component.ngOnChanges({
        data: new SimpleChange(null, undefined, false),
      });

      expect((component as any).drawTable).not.toHaveBeenCalled();
    });

    it('should not call drawTable if columns are missing', () => {
      component.data = [{ id: 1 }];
      component.columns = undefined;

      vi.spyOn<any, any>(component, 'drawTable');

      component.ngOnChanges({
        data: new SimpleChange(null, [{ id: 1 }], false),
      });

      expect((component as any).drawTable).not.toHaveBeenCalled();
    });

    it('should catch and log errors during ngOnChanges', () => {
      component.data = [{ id: 1 }];
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];

      vi.spyOn<any, any>(component, 'drawTable').mockImplementation(() => {
        throw new Error('Test error');
      });

      component.ngOnChanges({
        data: new SimpleChange(null, [{ id: 1 }], false),
      });

      expect(mockErrorLogger.logError).toHaveBeenCalled();
      expect(mockErrorLogger.logError).toHaveBeenCalledWith(
        expect.any(Error),
        'Failed to process ngOnChanges in DataGridComponent',
      );
    });
  });

  describe('ngAfterViewInit', () => {
    it('should not throw error when tabulator is undefined', () => {
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });

    it('should catch errors when redraw fails', () => {
      // Create a mock tabulator with a redraw method that throws
      (component as any).tabulator = {
        redraw: vi.fn().mockImplementation(() => {
          throw new Error('Redraw error');
        }),
      };

      component.ngAfterViewInit();

      expect(mockErrorLogger.logError).toHaveBeenCalledWith(
        expect.any(Error),
        'Failed to redraw tabulator',
        { show: false, report: false },
      );
    });
  });

  describe('Column Mapping', () => {
    it('should map basic column properties', () => {
      const columns: IGridColumn[] = [
        {
          field: 'testField',
          title: 'Test Title',
          dbType: 'string',
        },
      ];

      component.columns = columns;
      component.data = [{ testField: 'value' }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.columns).toBeDefined();
      expect((component as any).tabulatorOptions.columns[0].field).toBe(
        'testField',
      );
      expect((component as any).tabulatorOptions.columns[0].title).toBe(
        'Test Title',
      );
    });

    it('should map column with tooltip', () => {
      const tooltipFn = (cell: unknown) => 'Tooltip text';
      const columns: IGridColumn[] = [
        {
          field: 'testField',
          title: 'Test',
          dbType: 'string',
          tooltip: tooltipFn,
        },
      ];

      component.columns = columns;
      component.data = [{ testField: 'value' }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.columns[0].tooltip).toBe(
        tooltipFn,
      );
    });

    it('should map column with formatter', () => {
      const columns: IGridColumn[] = [
        {
          field: 'testField',
          title: 'Test',
          dbType: 'string',
          formatter: 'money',
        },
      ];

      component.columns = columns;
      component.data = [{ testField: 100 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.columns[0].formatter).toBe(
        'money',
      );
    });

    it('should map column horizontal alignment', () => {
      const columns: IGridColumn[] = [
        {
          field: 'amount',
          title: 'Amount',
          dbType: 'number',
          hozAlign: 'right',
        },
      ];

      component.columns = columns;
      component.data = [{ amount: 100 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.columns[0].hozAlign).toBe(
        'right',
      );
    });

    it('should map column widthGrow', () => {
      const columns: IGridColumn[] = [
        {
          field: 'description',
          title: 'Description',
          dbType: 'string',
          widthGrow: 2,
        },
      ];

      component.columns = columns;
      component.data = [{ description: 'Test' }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.columns[0].widthGrow).toBe(2);
    });

    it('should map column widthShrink', () => {
      const columns: IGridColumn[] = [
        {
          field: 'id',
          title: 'ID',
          dbType: 'int',
          widthShrink: 1,
        },
      ];

      component.columns = columns;
      component.data = [{ id: 1 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.columns[0].widthShrink).toBe(
        1,
      );
    });

    it('should map column width', () => {
      const columns: IGridColumn[] = [
        {
          field: 'status',
          title: 'Status',
          dbType: 'string',
          width: 100,
        },
      ];

      component.columns = columns;
      component.data = [{ status: 'active' }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.columns[0].width).toBe(100);
    });

    it('should map column width as string', () => {
      const columns: IGridColumn[] = [
        {
          field: 'status',
          title: 'Status',
          dbType: 'string',
          width: '150px',
        },
      ];

      component.columns = columns;
      component.data = [{ status: 'active' }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.columns[0].width).toBe(
        '150px',
      );
    });

    it('should handle column with Id suffix as link', () => {
      const columns: IGridColumn[] = [
        {
          field: 'userId',
          title: 'User',
          dbType: 'int',
          colName: 'UserId',
        },
      ];

      component.columns = columns;
      component.data = [{ userId: 123 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.columns[0].formatter).toBe(
        'link',
      );
      expect(
        (component as any).tabulatorOptions.columns[0].formatterParams.url,
      ).toBe('test-url');
      expect(
        (component as any).tabulatorOptions.columns[0].cellClick,
      ).toBeDefined();

      // Test cellClick callback
      const mockEvent = { preventDefault: vi.fn(), stopPropagation: vi.fn() };
      const cellClickHandler = (component as any).tabulatorOptions.columns[0]
        .cellClick;
      const logSpy = vi.spyOn(console, 'log');

      cellClickHandler(mockEvent, { value: 123 });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith('cellClick', { value: 123 });
    });

    it('should not set link formatter for Id column', () => {
      const columns: IGridColumn[] = [
        {
          field: 'id',
          title: 'ID',
          dbType: 'int',
          colName: 'Id',
        },
      ];

      component.columns = columns;
      component.data = [{ id: 1 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect(
        (component as any).tabulatorOptions.columns[0].formatter,
      ).toBeUndefined();
    });
  });

  describe('Tabulator Options', () => {
    it('should set height when provided', () => {
      component.height = '400px';
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = [{ id: 1 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.height).toBe('400px');
    });

    it('should set maxHeight when provided', () => {
      component.maxHeight = 500;
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = [{ id: 1 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.maxHeight).toBe(500);
    });

    it('should set groupBy when provided', () => {
      component.groupBy = 'category';
      component.columns = [
        { field: 'id', title: 'ID', dbType: 'int' },
        { field: 'category', title: 'Category', dbType: 'string' },
      ];
      component.data = [
        { id: 1, category: 'A' },
        { id: 2, category: 'B' },
      ];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.groupBy).toBe('category');
      expect((component as any).tabulatorOptions.groupHeader).toBeDefined();
    });

    it('should generate group header with singular record', () => {
      component.groupBy = 'status';
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = [{ id: 1, status: 'active' }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      const groupHeader = (component as any).tabulatorOptions.groupHeader;
      const result = groupHeader('active', 1);

      expect(result).toContain('status: active');
      expect(result).toContain('(1 record)');
    });

    it('should generate group header with plural records', () => {
      component.groupBy = 'status';
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = [
        { id: 1, status: 'active' },
        { id: 2, status: 'active' },
      ];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      const groupHeader = (component as any).tabulatorOptions.groupHeader;
      const result = groupHeader('active', 2);

      expect(result).toContain('status: active');
      expect(result).toContain('(2 records)');
    });

    it('should set layout from input', () => {
      component.layout = 'fitData';
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = [{ id: 1 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.layout).toBe('fitData');
    });

    it('should default to fitColumns layout', () => {
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = [{ id: 1 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.layout).toBe('fitColumns');
    });

    it('should set selectable rows', () => {
      component.selectable = true;
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = [{ id: 1 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.selectableRows).toBe(true);
    });

    it('should set rowContextMenu when provided', () => {
      const mockContextMenu = [
        {
          label: 'Edit',
          action: (e: Event, row: unknown) => {
            console.log('edit', row);
          },
        },
      ];

      component.rowContextMenu = mockContextMenu as any;
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = [{ id: 1 }];

      vi.spyOn<any, any>(component, 'createTabulatorGrid');

      (component as any).drawTable();

      expect((component as any).tabulatorOptions.rowContextMenu).toBe(
        mockContextMenu,
      );
    });
  });

  describe('drawTable edge cases', () => {
    it('should log warning when columns are undefined', () => {
      const warnSpy = vi.spyOn(console, 'warn');
      component.columns = undefined;
      component.data = [{ id: 1 }];

      (component as any).drawTable();

      expect(warnSpy).toHaveBeenCalled();
    });

    it('should log warning when data is undefined', () => {
      const warnSpy = vi.spyOn(console, 'warn');
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = undefined;

      (component as any).drawTable();

      expect(warnSpy).toHaveBeenCalled();
    });

    it('should log error when tabulatorDiv is undefined', () => {
      component.columns = [{ field: 'id', title: 'ID', dbType: 'int' }];
      component.data = [{ id: 1 }];
      (component as any).tabulatorDiv = undefined;

      (component as any).drawTable();

      expect(mockErrorLogger.logError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('Output Events', () => {
    it('should emit rowSelected event', async () => {
      const promise = new Promise<void>((resolve) => {
        component.rowSelected.subscribe((result) => {
          expect(result).toBeDefined();
          expect(result.row).toBeDefined();
          resolve();
        });
      });

      component.rowSelected.emit({ row: { id: 1 } });
      await promise;
    });

    it('should emit rowSelected with event', async () => {
      const mockEvent = new Event('click');

      const promise = new Promise<void>((resolve) => {
        component.rowSelected.subscribe((result) => {
          expect(result.event).toBe(mockEvent);
          expect(result.row).toEqual({ id: 1 });
          resolve();
        });
      });

      component.rowSelected.emit({ row: { id: 1 }, event: mockEvent });
      await promise;
    });
  });
});
