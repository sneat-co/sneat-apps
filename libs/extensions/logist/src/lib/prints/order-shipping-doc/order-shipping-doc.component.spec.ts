import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { provideLogistMocks } from '../../testing/test-utils';
import { LogistOrderService } from '../../services';
import { OrderShippingDocComponent } from './order-shipping-doc.component';

vi.mock('@angular/fire/firestore');

describe('OrderShippingDocComponent', () => {
  let component: OrderShippingDocComponent;
  let fixture: ComponentFixture<OrderShippingDocComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderShippingDocComponent],
      providers: [
        ...provideLogistMocks(),
        LogistOrderService,
        {
          provide: SneatApiService,
          useValue: {
            post: vi.fn(() => of({})),
            get: vi.fn(() => of({})),
            delete: vi.fn(() => of({})),
          },
        },
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(OrderShippingDocComponent, {
        set: {
          imports: [],
          providers: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrderShippingDocComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
