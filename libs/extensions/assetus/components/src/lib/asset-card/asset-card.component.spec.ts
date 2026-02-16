import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AssetCardComponent } from './asset-card.component';
import { provideAssetusMocks } from '../testing/test-utils';
import { IAssetContext } from '@sneat/mod-assetus-core';
import { SimpleChange } from '@angular/core';

describe('AssetCardComponent', () => {
  let component: AssetCardComponent;
  let fixture: ComponentFixture<AssetCardComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetCardComponent],
      providers: [provideRouter([]), ...provideAssetusMocks()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should set segment to income when incomes count is greater than expenses count', () => {
      const asset: IAssetContext = {
        id: 'asset1',
        dbo: {
          totals: {
            incomes: { count: 10 },
            expenses: { count: 5 },
          },
        },
      } as IAssetContext;

      component.asset = asset;
      component.ngOnChanges({
        asset: new SimpleChange(null, asset, true),
      });

      expect(component.segment).toBe('income');
    });

    it('should set segment to income when incomes exist and expenses do not', () => {
      const asset: IAssetContext = {
        id: 'asset1',
        dbo: {
          totals: {
            incomes: { count: 5 },
          },
        },
      } as IAssetContext;

      component.asset = asset;
      component.ngOnChanges({
        asset: new SimpleChange(null, asset, true),
      });

      expect(component.segment).toBe('income');
    });

    it('should keep segment as expenses when expenses count is greater', () => {
      const asset: IAssetContext = {
        id: 'asset1',
        dbo: {
          totals: {
            incomes: { count: 5 },
            expenses: { count: 10 },
          },
        },
      } as IAssetContext;

      component.segment = 'expenses';
      component.asset = asset;
      component.ngOnChanges({
        asset: new SimpleChange(null, asset, true),
      });

      expect(component.segment).toBe('expenses');
    });

    it('should not change segment when asset has no totals', () => {
      const asset: IAssetContext = {
        id: 'asset1',
        dbo: {},
      } as IAssetContext;

      component.segment = 'expenses';
      component.asset = asset;
      component.ngOnChanges({
        asset: new SimpleChange(null, asset, true),
      });

      expect(component.segment).toBe('expenses');
    });
  });

  describe('segmentChanged', () => {
    it('should update segment value', () => {
      const event = {
        detail: { value: 'income' },
      } as CustomEvent;

      component.segmentChanged(event);

      expect(component.segment).toBe('income');
    });

    it('should handle expenses segment', () => {
      const event = {
        detail: { value: 'expenses' },
      } as CustomEvent;

      component.segmentChanged(event);

      expect(component.segment).toBe('expenses');
    });
  });
});
