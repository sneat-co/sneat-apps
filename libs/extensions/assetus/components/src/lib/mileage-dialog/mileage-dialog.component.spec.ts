import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MileAgeDialogComponent } from './mileage-dialog.component';
import { provideAssetusMocks } from '../testing/test-utils';
import { ModalController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';
import { AssetService } from '../services';

describe('MileAgeDialogComponent', () => {
  let component: MileAgeDialogComponent;
  let fixture: ComponentFixture<MileAgeDialogComponent>;
  let modalCtrl: ModalController;
  let assetService: AssetService;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [MileAgeDialogComponent],
      providers: [...provideAssetusMocks()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MileAgeDialogComponent);
    component = fixture.componentInstance;
    modalCtrl = TestBed.inject(ModalController);
    assetService = TestBed.inject(AssetService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    beforeEach(() => {
      component.space = { id: 'space1', brief: { title: 'Test Space' } };
      component.asset = { id: 'asset1', brief: { title: 'Test Asset' } };
    });

    it('should throw error when asset id is not set', () => {
      component.asset = undefined;

      expect(() => component.submit()).toThrow('assetId is not set');
    });

    it('should throw error when space id is not set', () => {
      component.space = undefined;

      expect(() => component.submit()).toThrow('spaceId is not set');
    });

    it('should throw error when fuelVolume is set but fuelVolumeUnit is not', () => {
      component['fuelVolume'].setValue(50);
      component['fuelVolumeUnit'].setValue(undefined);

      expect(() => component.submit()).toThrow(
        'fuelVolume and fuelVolumeUnit should be both set or both unset',
      );
    });

    it('should throw error when fuelVolumeUnit is set but fuelVolume is not', () => {
      component['fuelVolume'].setValue(undefined);
      component['fuelVolumeUnit'].setValue('l');

      expect(() => component.submit()).toThrow(
        'fuelVolume and fuelVolumeUnit should be both set or both unset',
      );
    });

    it('should throw error when fuelCost is set but currency is not', () => {
      component['fuelCost'].setValue(100);
      component['currency'].setValue(undefined);

      expect(() => component.submit()).toThrow(
        'fuelCost and currency should be both set or both unset',
      );
    });

    it('should throw error when currency is set but fuelCost is not', () => {
      component['fuelCost'].setValue(undefined);
      component['currency'].setValue('USD');

      expect(() => component.submit()).toThrow(
        'fuelCost and currency should be both set or both unset',
      );
    });

    it('should throw error when mileage is set but mileageUnit is not', () => {
      component['mileage'].setValue(50000);
      component['mileageUnit'].setValue(undefined);

      expect(() => component.submit()).toThrow(
        'mileage and mileageUnit should be both set or both unset',
      );
    });

    it('should throw error when mileageUnit is set but mileage is not', () => {
      component['mileage'].setValue(undefined);
      component['mileageUnit'].setValue('km');

      expect(() => component.submit()).toThrow(
        'mileage and mileageUnit should be both set or both unset',
      );
    });

    it('should call assetService.addVehicleRecord with correct data', () => {
      component['fuelVolume'].setValue(50);
      component['fuelVolumeUnit'].setValue('l');
      component['fuelCost'].setValue(100);
      component['currency'].setValue('EUR');
      component['mileage'].setValue(50000);
      component['mileageUnit'].setValue('km');

      vi.spyOn(assetService, 'addVehicleRecord').mockReturnValue(of(undefined));
      vi.spyOn(modalCtrl, 'dismiss').mockResolvedValue(true);

      component.submit();

      expect(assetService.addVehicleRecord).toHaveBeenCalledWith({
        spaceID: 'space1',
        assetID: 'asset1',
        fuelVolume: 50,
        fuelVolumeUnit: 'l',
        fuelCost: 100,
        currency: 'EUR',
        mileage: 50000,
        mileageUnit: 'km',
      });
    });

    it('should dismiss modal on success', async () => {
      component['mileage'].setValue(50000);
      component['mileageUnit'].setValue('km');

      vi.spyOn(assetService, 'addVehicleRecord').mockReturnValue(of(undefined));
      const dismissSpy = vi
        .spyOn(modalCtrl, 'dismiss')
        .mockResolvedValue(true);

      component.submit();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(dismissSpy).toHaveBeenCalled();
    });

    it('should handle submission with only mileage', () => {
      component['mileage'].setValue(50000);
      component['mileageUnit'].setValue('km');

      vi.spyOn(assetService, 'addVehicleRecord').mockReturnValue(of(undefined));
      vi.spyOn(modalCtrl, 'dismiss').mockResolvedValue(true);

      component.submit();

      expect(assetService.addVehicleRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          mileage: 50000,
          mileageUnit: 'km',
          fuelVolume: undefined,
          fuelCost: undefined,
        }),
      );
    });
  });

  describe('cancel', () => {
    it('should dismiss modal', () => {
      const dismissSpy = vi
        .spyOn(modalCtrl, 'dismiss')
        .mockResolvedValue(true);

      component.cancel();

      expect(dismissSpy).toHaveBeenCalled();
    });
  });
});
