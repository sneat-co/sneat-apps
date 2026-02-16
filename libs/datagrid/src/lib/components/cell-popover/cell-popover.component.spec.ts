import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CellPopoverComponent } from './cell-popover.component';

describe('CellPopoverComponent', () => {
  let component: CellPopoverComponent;
  let fixture: ComponentFixture<CellPopoverComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [CellPopoverComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CellPopoverComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges here - let individual tests control when it's called
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should accept column input', () => {
      const mockColumn = {
        name: 'testColumn',
        title: 'Test Column',
        dbType: 'varchar',
      };

      component.column = mockColumn;
      expect(component.column).toEqual(mockColumn);
    });

    it('should accept value input', () => {
      const testValue = 'Test Value';
      component.value = testValue;
      expect(component.value).toBe(testValue);
    });

    it('should accept numeric value', () => {
      const testValue = 42;
      component.value = testValue;
      expect(component.value).toBe(testValue);
    });

    it('should accept null value', () => {
      component.value = null;
      expect(component.value).toBeNull();
    });

    it('should accept undefined value', () => {
      component.value = undefined;
      expect(component.value).toBeUndefined();
    });

    it('should accept foreign key input', () => {
      const mockFk = {
        name: 'fk_user_id',
        columns: ['user_id'],
        refTable: {
          name: 'users',
          schema: 'public',
          catalog: 'main',
        },
      };

      component.fk = mockFk;
      expect(component.fk).toEqual(mockFk);
    });

    it('should accept foreign key without catalog', () => {
      const mockFk = {
        name: 'fk_order_id',
        columns: ['order_id'],
        refTable: {
          name: 'orders',
          schema: 'public',
        },
      };

      component.fk = mockFk;
      expect(component.fk).toEqual(mockFk);
    });
  });

  describe('Tab Property', () => {
    it('should default tab to "rec"', () => {
      expect(component.tab).toBe('rec');
    });

    it('should allow changing tab to "cols"', () => {
      component.tab = 'cols';
      expect(component.tab).toBe('cols');
    });

    it('should allow changing tab to "refs"', () => {
      component.tab = 'refs';
      expect(component.tab).toBe('refs');
    });

    it('should allow switching between tabs', () => {
      expect(component.tab).toBe('rec');

      component.tab = 'cols';
      expect(component.tab).toBe('cols');

      component.tab = 'refs';
      expect(component.tab).toBe('refs');

      component.tab = 'rec';
      expect(component.tab).toBe('rec');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle column with all properties', () => {
      const fullColumn = {
        name: 'user_email',
        title: 'User Email Address',
        dbType: 'varchar(255)',
      };

      component.column = fullColumn;
      component.value = 'user@example.com';

      expect(component.column.name).toBe('user_email');
      expect(component.column.title).toBe('User Email Address');
      expect(component.column.dbType).toBe('varchar(255)');
      expect(component.value).toBe('user@example.com');
    });

    it('should handle column without title', () => {
      const columnWithoutTitle = {
        name: 'status',
        dbType: 'int',
      };

      component.column = columnWithoutTitle;
      component.value = 1;

      expect(component.column.title).toBeUndefined();
      expect(component.column.name).toBe('status');
    });

    it('should handle multiple foreign key columns', () => {
      const multiFk = {
        name: 'fk_composite',
        columns: ['user_id', 'account_id', 'tenant_id'],
        refTable: {
          name: 'user_accounts',
          schema: 'auth',
          catalog: 'main',
        },
      };

      component.fk = multiFk;

      expect(component.fk.columns.length).toBe(3);
      expect(component.fk.columns).toContain('user_id');
      expect(component.fk.columns).toContain('account_id');
      expect(component.fk.columns).toContain('tenant_id');
    });
  });
});
