import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular/standalone';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { LogistOrderService } from '../../services';
import { OrderContainersSelectorService } from '../order-containers-selector/order-containers-selector.service';
import { DispatchPointComponent } from './dispatch-point.component';

vi.mock('@angular/fire/firestore');

describe('DispatchPointComponent', () => {
  let component: DispatchPointComponent;
  let fixture: ComponentFixture<DispatchPointComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchPointComponent],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        LogistOrderService,
        OrderContainersSelectorService,
        {
          provide: ModalController,
          useValue: { create: vi.fn() },
        },
        {
          provide: SneatApiService,
          useValue: { post: vi.fn(() => of({})), delete: vi.fn(() => of({})) },
        },
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DispatchPointComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DispatchPointComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
