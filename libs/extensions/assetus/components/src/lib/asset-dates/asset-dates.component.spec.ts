import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetDatesComponent } from './asset-dates.component';
import {
  IAssetDbo,
  IAssetDboBase,
  IAssetVehicleExtra,
} from '@sneat/mod-assetus-core';

describe('AssetDatesComponent', () => {
  let component: AssetDatesComponent;
  let fixture: ComponentFixture<AssetDatesComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetDatesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('asset setter', () => {
    it('should set items for vehicle category', () => {
      const vehicleAsset: IAssetDbo<'vehicle', IAssetVehicleExtra> = {
        category: 'vehicle',
        title: 'My Car',
        extra: {
          nctExpires: '2024-12-31',
          taxExpires: '2024-11-30',
          nextServiceDue: '2024-10-15',
        },
      } as IAssetDbo<'vehicle', IAssetVehicleExtra>;

      component.asset = vehicleAsset;

      expect(component['items']).toHaveLength(3);
      expect(component['items']?.[0]).toEqual({
        name: 'nctExpires',
        title: 'NCT expires',
        value: '2024-12-31',
      });
      expect(component['items']?.[1]).toEqual({
        name: 'taxExpires',
        title: 'Tax expires',
        value: '2024-11-30',
      });
      expect(component['items']?.[2]).toEqual({
        name: 'nextServiceDue',
        title: 'Next service due',
        value: '2024-10-15',
      });
    });

    it('should set items for dwelling category', () => {
      const dwellingAsset: IAssetDboBase = {
        category: 'dwelling',
        title: 'My House',
      } as IAssetDboBase;

      component.asset = dwellingAsset;

      expect(component['items']).toHaveLength(1);
      expect(component['items']?.[0]).toEqual({
        name: 'leaseExpires',
        title: 'Lease expires',
        value: 'property.leaseExpires',
      });
    });

    it('should set empty items for other categories', () => {
      const otherAsset: IAssetDboBase = {
        category: 'document' as any,
        title: 'My Document',
      } as IAssetDboBase;

      component.asset = otherAsset;

      expect(component['items']).toEqual([]);
    });

    it('should handle vehicle with missing extra fields', () => {
      const vehicleAsset: IAssetDbo<'vehicle', IAssetVehicleExtra> = {
        category: 'vehicle',
        title: 'My Car',
        extra: {},
      } as IAssetDbo<'vehicle', IAssetVehicleExtra>;

      component.asset = vehicleAsset;

      expect(component['items']).toHaveLength(3);
      expect(component['items']?.[0].value).toBeUndefined();
      expect(component['items']?.[1].value).toBeUndefined();
      expect(component['items']?.[2].value).toBeUndefined();
    });
  });

  describe('trackByName', () => {
    it('should return the name property', () => {
      const item = { name: 'testName', title: 'Test', value: '2024-01-01' };
      expect(component.trackByName(0, item)).toBe('testName');
    });
  });
});
