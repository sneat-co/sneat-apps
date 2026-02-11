import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrdersGridComponent } from './orders-grid.component';

describe('FreightsListComponent', () => {
  let component: OrdersGridComponent;
  let fixture: ComponentFixture<OrdersGridComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersGridComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(OrdersGridComponent, {
        set: { imports: [], providers: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrdersGridComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
