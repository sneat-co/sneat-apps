import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { OrderPrintMenuComponent } from './order-print-menu.component';

describe('OrderPrintMenuComponent', () => {
  let component: OrderPrintMenuComponent;
  let fixture: ComponentFixture<OrderPrintMenuComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPrintMenuComponent],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: PopoverController,
          useValue: { dismiss: vi.fn(() => Promise.resolve()) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(OrderPrintMenuComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrderPrintMenuComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
