import { mergeValuesWithIDs, IWithStringID } from './todo_move_funcs';

describe('todo_move_funcs', () => {
  describe('mergeValuesWithIDs', () => {
    it('should return empty array when input is undefined', () => {
      const result = mergeValuesWithIDs(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array when input is empty object', () => {
      const result = mergeValuesWithIDs({});
      expect(result).toEqual([]);
    });

    it('should merge single value with its id', () => {
      const input = { 'id1': { name: 'test' } };
      const result = mergeValuesWithIDs(input);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: 'test', id: 'id1' });
    });

    it('should merge multiple values with their ids', () => {
      const input = {
        'id1': { name: 'first' },
        'id2': { name: 'second' },
        'id3': { name: 'third' },
      };
      const result = mergeValuesWithIDs(input);
      
      expect(result).toHaveLength(3);
      expect(result).toContainEqual({ name: 'first', id: 'id1' });
      expect(result).toContainEqual({ name: 'second', id: 'id2' });
      expect(result).toContainEqual({ name: 'third', id: 'id3' });
    });

    it('should handle complex objects', () => {
      interface TestObject {
        title: string;
        count: number;
        nested: { value: string };
      }
      
      const input: Record<string, TestObject> = {
        'abc': { 
          title: 'Test', 
          count: 42, 
          nested: { value: 'nested' } 
        },
      };
      const result = mergeValuesWithIDs(input);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        title: 'Test',
        count: 42,
        nested: { value: 'nested' },
        id: 'abc',
      });
    });

    it('should preserve all object properties', () => {
      const input = {
        'key1': { 
          prop1: 'value1', 
          prop2: 123, 
          prop3: true,
          prop4: null,
        },
      };
      const result = mergeValuesWithIDs(input);
      
      expect(result[0]).toHaveProperty('prop1', 'value1');
      expect(result[0]).toHaveProperty('prop2', 123);
      expect(result[0]).toHaveProperty('prop3', true);
      expect(result[0]).toHaveProperty('prop4', null);
      expect(result[0]).toHaveProperty('id', 'key1');
    });
  });
});
