import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { provideLogistMocks } from '../../testing/test-utils';
import { LogistOrderService } from '../../services';
import { OrderExpeditionPrintDocComponent } from './order-expedition-print-doc.component';

vi.mock('@angular/fire/firestore');

describe('OrderExpeditionPrintDocComponent', () => {
  let component: OrderExpeditionPrintDocComponent;
  let fixture: ComponentFixture<OrderExpeditionPrintDocComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderExpeditionPrintDocComponent],
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
      .overrideComponent(OrderExpeditionPrintDocComponent, {
        set: {
          imports: [],
          providers: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrderExpeditionPrintDocComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
