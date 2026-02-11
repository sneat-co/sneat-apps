import { getTabulatorCols, IGridColumn } from './grid-models';

describe('grid-models', () => {
  describe('getTabulatorCols', () => {
    it('should remove dbType from column definitions', () => {
      const cols: IGridColumn[] = [
        { field: 'id', title: 'ID', dbType: 'string' },
        { field: 'name', title: 'Name', dbType: 'string' },
      ];
      const result = getTabulatorCols(cols);
      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('dbType');
      expect(result[1]).not.toHaveProperty('dbType');
      expect(result[0]).toMatchObject({ field: 'id', title: 'ID' });
      expect(result[1]).toMatchObject({ field: 'name', title: 'Name' });
    });

    it('should return empty array for empty input', () => {
      expect(getTabulatorCols([])).toEqual([]);
    });
  });
});
