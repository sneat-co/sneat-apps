import { TabulatorColumn, TabulatorOptions } from './tabulator-options';

describe('Tabulator Types', () => {
  describe('TabulatorColumn', () => {
    it('should accept valid column definition', () => {
      const column: TabulatorColumn = {
        field: 'testField',
        title: 'Test Title',
      };

      expect(column.field).toBe('testField');
      expect(column.title).toBe('Test Title');
    });

    it('should accept column with formatter', () => {
      const column: TabulatorColumn = {
        field: 'amount',
        title: 'Amount',
        formatter: 'money',
      };

      expect(column.formatter).toBe('money');
    });

    it('should accept column with width', () => {
      const column: TabulatorColumn = {
        field: 'id',
        title: 'ID',
        width: 100,
      };

      expect(column.width).toBe(100);
    });

    it('should accept column with alignment', () => {
      const column: TabulatorColumn = {
        field: 'price',
        title: 'Price',
        hozAlign: 'right',
      };

      expect(column.hozAlign).toBe('right');
    });
  });

  describe('TabulatorOptions', () => {
    it('should accept valid options', () => {
      const options: TabulatorOptions = {
        data: [{ id: 1, name: 'Test' }],
        layout: 'fitColumns',
      };

      expect(options.data).toBeDefined();
      expect(options.layout).toBe('fitColumns');
    });

    it('should accept columns in options', () => {
      const options: TabulatorOptions = {
        columns: [
          { field: 'id', title: 'ID' },
          { field: 'name', title: 'Name' },
        ],
      };

      expect(options.columns).toBeDefined();
      expect(options.columns?.length).toBe(2);
    });

    it('should accept height options', () => {
      const optionsWithHeight: TabulatorOptions = {
        height: '400px',
      };

      expect(optionsWithHeight.height).toBe('400px');

      const optionsWithNumericHeight: TabulatorOptions = {
        height: 500,
      };

      expect(optionsWithNumericHeight.height).toBe(500);
    });

    it('should accept maxHeight option', () => {
      const options: TabulatorOptions = {
        maxHeight: 600,
      };

      expect(options.maxHeight).toBe(600);
    });

    it('should accept layout options', () => {
      const fitDataOptions: TabulatorOptions = {
        layout: 'fitData',
      };

      expect(fitDataOptions.layout).toBe('fitData');

      const fitColumnsOptions: TabulatorOptions = {
        layout: 'fitColumns',
      };

      expect(fitColumnsOptions.layout).toBe('fitColumns');
    });
  });

  describe('Type Compatibility', () => {
    it('should work with empty options', () => {
      const options: TabulatorOptions = {};

      expect(options).toBeDefined();
    });

    it('should work with minimal column definition', () => {
      const column: TabulatorColumn = {
        field: 'id',
      };

      expect(column.field).toBe('id');
    });

    it('should support complex options configuration', () => {
      const options: TabulatorOptions = {
        data: [
          { id: 1, name: 'John', age: 30 },
          { id: 2, name: 'Jane', age: 25 },
        ],
        columns: [
          { field: 'id', title: 'ID', width: 50 },
          { field: 'name', title: 'Name', hozAlign: 'left' },
          { field: 'age', title: 'Age', hozAlign: 'right' },
        ],
        layout: 'fitColumns',
        height: 400,
      };

      expect(options.data?.length).toBe(2);
      expect(options.columns?.length).toBe(3);
      expect(options.layout).toBe('fitColumns');
      expect(options.height).toBe(400);
    });
  });
});
