import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { MultiSelectorService } from './multi-selector.service';

describe('MultiSelectorService', () => {
  it('should create', () => {
    const errorLogger = {
      logError: vi.fn(),
      logErrorHandler: () => vi.fn(),
    };
    const modalController = { create: vi.fn() } as unknown as ModalController;
    expect(new MultiSelectorService(errorLogger, modalController)).toBeTruthy();
  });
});
