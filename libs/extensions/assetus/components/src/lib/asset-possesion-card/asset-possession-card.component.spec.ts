import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AssetPossessionCardComponent } from './asset-possession-card.component';
import { IAssetContext } from '@sneat/mod-assetus-core';
import { provideAssetusMocks } from '../testing/test-utils';

describe('AssetPossessionCardComponent', () => {
  let component: AssetPossessionCardComponent;
  let fixture: ComponentFixture<AssetPossessionCardComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetPossessionCardComponent],
      providers: [...provideAssetusMocks()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPossessionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have possession options', () => {
    expect(component['possessionOptions']).toBeDefined();
    expect(component['possessionOptions'].length).toBeGreaterThan(0);
  });

  describe('onPossessionChanged', () => {
    it('should update asset possession and emit change', () => {
      const mockAsset: IAssetContext = {
        id: 'asset1',
        dbo: {
          title: 'Test Asset',
          category: 'vehicle',
        },
      } as IAssetContext;

      component.asset = mockAsset;
      const emitSpy = vi.fn();
      component.assetChange.subscribe(emitSpy);

      component['onPossessionChanged']('owned');

      expect(component.asset.dbo.possession).toBe('owned');
      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'asset1',
          dbo: expect.objectContaining({
            possession: 'owned',
          }),
        }),
      );
    });

    it('should not emit when asset is undefined', () => {
      component.asset = undefined;
      const emitSpy = vi.fn();
      component.assetChange.subscribe(emitSpy);

      component['onPossessionChanged']('owned');

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when asset.dbo is undefined', () => {
      component.asset = { id: 'asset1' } as IAssetContext;
      const emitSpy = vi.fn();
      component.assetChange.subscribe(emitSpy);

      component['onPossessionChanged']('owned');

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should handle different possession types', () => {
      const possessions = ['owned', 'rented', 'leased'];
      const mockAsset: IAssetContext = {
        id: 'asset1',
        dbo: { title: 'Test Asset', category: 'vehicle' },
      } as IAssetContext;

      component.asset = mockAsset;
      const emitSpy = vi.fn();
      component.assetChange.subscribe(emitSpy);

      possessions.forEach((possession) => {
        component['onPossessionChanged'](possession);
        expect(component.asset?.dbo.possession).toBe(possession);
      });

      expect(emitSpy).toHaveBeenCalledTimes(possessions.length);
    });
  });
});
