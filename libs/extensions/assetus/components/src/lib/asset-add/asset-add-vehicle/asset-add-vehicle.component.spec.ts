import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetAddVehicleComponent } from './asset-add-vehicle.component';
import { provideAssetusMocks } from '../../testing/test-utils';

describe('AssetAddVehicleComponent', () => {
  let component: AssetAddVehicleComponent;
  let fixture: ComponentFixture<AssetAddVehicleComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAddVehicleComponent],
      providers: [...provideAssetusMocks()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(AssetAddVehicleComponent, {
        set: { imports: [], providers: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetAddVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
