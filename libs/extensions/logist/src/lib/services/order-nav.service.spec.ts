import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { OrderNavService } from './order-nav.service';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { ILogistOrderContext } from '../dto';

describe('OrderNavService', () => {
  let service: OrderNavService;
  let navMock: Partial<Record<keyof NavController, Mock>>;

  beforeEach(() => {
    navMock = {
      navigateForward: vi.fn().mockResolvedValue(true),
      navigateBack: vi.fn().mockResolvedValue(true),
    };

    TestBed.configureTestingModule({
      providers: [
        OrderNavService,
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: () => vi.fn(),
          },
        },
        { provide: NavController, useValue: navMock },
      ],
    });
    service = TestBed.inject(OrderNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('goOrderPage', () => {
    const order = {
      id: 'o1',
      space: { id: 's1', type: 'team' },
    } as unknown as ILogistOrderContext;

    it('should navigate forward to basic order page', async () => {
      await service.goOrderPage('forward', order);
      expect(navMock.navigateForward).toHaveBeenCalledWith(
        '/space/team/s1/order/o1',
        { state: undefined },
      );
    });

    it('should navigate back to order page', async () => {
      await service.goOrderPage('back', order);
      expect(navMock.navigateBack).toHaveBeenCalledWith(
        '/space/team/s1/order/o1',
        { state: undefined },
      );
    });

    it('should include extra path and parameters', async () => {
      await service.goOrderPage(
        'forward',
        order,
        { path: 'edit' },
        { debug: 'true' },
      );
      expect(navMock.navigateForward).toHaveBeenCalledWith(
        '/space/team/s1/order/o1/edit?debug=true',
        { state: undefined },
      );
    });

    it('should include fragment', async () => {
      await service.goOrderPage('forward', order, {
        path: 'view',
        fragment: 'section1',
      });
      expect(navMock.navigateForward).toHaveBeenCalledWith(
        '/space/team/s1/order/o1/view#section1',
        { state: undefined },
      );
    });
  });
});
