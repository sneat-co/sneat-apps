import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { OrderNavService } from '../../services';
import { NewShippingPointService } from '../new-shipping-point/new-shipping-point.service';
import { ShippingPointsSelectorComponent } from './shipping-points-selector.component';

describe('ShippingPointsSelectorComponent', () => {
  let component: ShippingPointsSelectorComponent;
  let fixture: ComponentFixture<ShippingPointsSelectorComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingPointsSelectorComponent],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        NewShippingPointService,
        {
          provide: ModalController,
          useValue: { create: vi.fn() },
        },
        {
          provide: OrderNavService,
          useValue: { goOrderPage: vi.fn(() => Promise.resolve(true)) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ShippingPointsSelectorComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ShippingPointsSelectorComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
