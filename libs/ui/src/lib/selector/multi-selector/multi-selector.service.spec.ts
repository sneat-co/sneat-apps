import { MultiSelectorService } from './multi-selector.service';
import { ISelectItem } from '../selector-interfaces';

describe('MultiSelectorService', () => {
  let service: MultiSelectorService;
  let errorLoggerMock: any;
  let modalControllerMock: any;

  beforeEach(() => {
    errorLoggerMock = {
      logError: vi.fn(),
      logErrorHandler: vi.fn(() => vi.fn()),
    };
    modalControllerMock = {
      create: vi.fn(),
    };
    service = new MultiSelectorService(errorLoggerMock, modalControllerMock);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('selectMultiple', () => {
    const items: ISelectItem[] = [{ id: '1', title: 'test' }];

    it('should resolve with selected items on success', async () => {
      const modalMock = {
        present: vi.fn().mockReturnValue(Promise.resolve()),
        onDidDismiss: vi.fn().mockReturnValue(
          Promise.resolve({ data: { selectedItems: items } }),
        ),
      };
      modalControllerMock.create.mockReturnValue(Promise.resolve(modalMock));

      const result = await service.selectMultiple(items, []);
      expect(result).toEqual(items);
      expect(modalControllerMock.create).toHaveBeenCalled();
      expect(modalMock.present).toHaveBeenCalled();
    });

    it('should reject and log error if modal creation fails', async () => {
      modalControllerMock.create.mockReturnValue(Promise.reject('fail'));
      await expect(service.selectMultiple([], [])).rejects.toBe('fail');
      expect(errorLoggerMock.logError).toHaveBeenCalledWith(
        'fail',
        'Failed to create modal',
      );
    });

    it('should reject and log error if modal presentation fails', async () => {
      const modalMock = {
        present: vi.fn().mockReturnValue(Promise.reject('present-fail')),
        onDidDismiss: vi.fn().mockReturnValue(new Promise(() => { /* never resolves */ })),
      };
      modalControllerMock.create.mockReturnValue(Promise.resolve(modalMock));
      await expect(service.selectMultiple([], [])).rejects.toBe('present-fail');
      expect(errorLoggerMock.logError).toHaveBeenCalledWith(
        'Failed to present modal',
      );
    });

    it('should reject and log error if modal dismiss fails', async () => {
      const modalMock = {
        present: vi.fn().mockReturnValue(Promise.resolve()),
        onDidDismiss: vi.fn().mockReturnValue(Promise.reject('dismiss-fail')),
      };
      modalControllerMock.create.mockReturnValue(Promise.resolve(modalMock));
      await expect(service.selectMultiple([], [])).rejects.toBe('dismiss-fail');
      expect(errorLoggerMock.logError).toHaveBeenCalledWith(
        'dismiss-fail',
        'Failed to handle modal dismiss',
      );
    });

    it('should resolve with empty array if selectedItems is missing in response', async () => {
      const modalMock = {
        present: vi.fn().mockReturnValue(Promise.resolve()),
        onDidDismiss: vi.fn().mockReturnValue(
          Promise.resolve({ data: {} }),
        ),
      };
      modalControllerMock.create.mockReturnValue(Promise.resolve(modalMock));

      const result = await service.selectMultiple([], []);
      expect(result).toEqual([]);
    });
  });
});
