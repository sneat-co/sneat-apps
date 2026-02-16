import { TestBed } from '@angular/core/testing';
import { ErrorLoggerService } from './error-logger.service';
import { ToastController } from '@ionic/angular/standalone';
import { captureException, showReportDialog } from '@sentry/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Mock } from 'vitest';

vi.mock('@sentry/angular', () => ({
  captureException: vi.fn().mockImplementation((...args: any[]) => {
    return 'event-id';
  }),
  showReportDialog: vi.fn(),
}));

describe('ErrorLoggerService', () => {
  let service: ErrorLoggerService;
  let toastController: { create: Mock; dismiss: Mock };

  beforeEach(() => {
    toastController = {
      create: vi.fn().mockReturnValue(
        Promise.resolve({
          present: vi.fn().mockReturnValue(Promise.resolve()),
        }),
      ),
      dismiss: vi.fn().mockReturnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      providers: [
        ErrorLoggerService,
        { provide: ToastController, useValue: toastController },
      ],
    });
    service = TestBed.inject(ErrorLoggerService);
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logError', () => {
    it('should log to console.error', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      service.logError(new Error('test'));
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should NOT capture exception if on localhost', () => {
      vi.stubGlobal('location', { hostname: 'localhost' });
      service.logError(new Error('test'), 'msg', { report: true });
      expect(captureException).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it('should capture exception if NOT on localhost', () => {
      vi.stubGlobal('location', { hostname: 'example.com' });
      service.logError(new Error('test'), 'msg', { report: true });
      expect(captureException).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it('should show error toast by default', () => {
      service.logError(new Error('test'));
      expect(toastController.create).toHaveBeenCalled();
    });

    it('should handle boolean true value as error', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      service.logError(true, 'test message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Argument exception'),
        expect.any(Error),
        undefined,
      );
      consoleSpy.mockRestore();
    });

    it('should handle boolean false value as error', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      service.logError(false, 'test message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Argument exception'),
        expect.any(Error),
        undefined,
      );
      consoleSpy.mockRestore();
    });

    it('should not show feedback dialog when feedback is false', () => {
      vi.stubGlobal('location', { hostname: 'example.com' });
      service.logError(new Error('test'), 'msg', {
        report: true,
        feedback: false,
      });
      expect(showReportDialog).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it('should show feedback dialog by default when capturing', () => {
      vi.stubGlobal('location', { hostname: 'example.com' });
      service.logError(new Error('test'), 'msg', { report: true });
      expect(showReportDialog).toHaveBeenCalledWith({ eventId: 'event-id' });
      vi.unstubAllGlobals();
    });

    it('should handle Sentry exception gracefully', () => {
      vi.stubGlobal('location', { hostname: 'example.com' });
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      vi.mocked(captureException).mockImplementationOnce(() => {
        throw new Error('Sentry failed');
      });

      service.logError(new Error('test'), 'msg', { report: true });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sentry failed'),
        expect.any(Error),
      );
      consoleSpy.mockRestore();
      vi.unstubAllGlobals();
    });

    it('should not show error when show option is false', () => {
      service.logError(new Error('test'), 'msg', { show: false });
      expect(toastController.create).not.toHaveBeenCalled();
    });

    it('should not report error when report option is false', () => {
      vi.stubGlobal('location', { hostname: 'example.com' });
      service.logError(new Error('test'), 'msg', { report: false });
      expect(captureException).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });
  });

  describe('showError', () => {
    it('should show toast with error message', async () => {
      await service.showError(new Error('test message'));
      expect(toastController.create).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'test message',
        }),
      );
    });

    it('should handle HttpErrorResponse with server message', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { error: { message: 'server fail' } },
      });
      await service.showError(errorResponse);
      expect(toastController.create).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('server fail'),
        }),
      );
    });

    it('should throw error if e is null (results in crash/throw)', () => {
      expect(() => service.showError(null as any)).toThrow();
    });

    it('should throw error for negative duration', () => {
      expect(() => service.showError('test', -1)).toThrow();
    });

    it('should warn when ToastController is not available', () => {
      const consoleSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ErrorLoggerService,
          { provide: ToastController, useValue: null },
        ],
      });
      const serviceWithoutToast = TestBed.inject(ErrorLoggerService);

      serviceWithoutToast.showError(new Error('test'));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ToastController not available'),
      );
      consoleSpy.mockRestore();
    });

    it('should handle toast present failure', async () => {
      const presentError = new Error('present failed');
      toastController.create.mockReturnValue(
        Promise.resolve({
          present: vi.fn().mockReturnValue(Promise.reject(presentError)),
        }),
      );
      const logErrorSpy = vi
        .spyOn(service, 'logError')
        .mockImplementation(() => undefined);

      await service.showError(new Error('test'));

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(logErrorSpy).toHaveBeenCalledWith(
        presentError,
        'Failed to present toast with error message:',
        { show: false },
      );
      logErrorSpy.mockRestore();
    });

    it('should handle toast creation failure', async () => {
      const createError = new Error('create failed');
      toastController.create.mockReturnValue(Promise.reject(createError));
      const logErrorSpy = vi
        .spyOn(service, 'logError')
        .mockImplementation(() => undefined);

      await service.showError(new Error('test'));

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(logErrorSpy).toHaveBeenCalledWith(
        createError,
        'Failed to create a toast with error message:',
        { show: false },
      );
      logErrorSpy.mockRestore();
    });

    it('should handle toast dismiss failure in button handler', async () => {
      const dismissError = new Error('dismiss failed');
      toastController.dismiss.mockReturnValue(Promise.reject(dismissError));
      const logErrorSpy = vi
        .spyOn(service, 'logError')
        .mockImplementation(() => undefined);

      await service.showError(new Error('test'));

      const createCall = toastController.create.mock.calls[0][0];
      const closeButtonHandler = createCall.buttons[0].handler;
      await closeButtonHandler();

      expect(logErrorSpy).toHaveBeenCalledWith(
        dismissError,
        'Failed to dismiss error dialog',
        { show: false },
      );
      logErrorSpy.mockRestore();
    });

    it('should use custom duration when provided', async () => {
      const customDuration = 5000;
      await service.showError(new Error('test'), customDuration);

      expect(toastController.create).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: customDuration,
        }),
      );
    });
  });

  describe('logErrorHandler', () => {
    it('should return a function that calls logError', () => {
      const logSpy = vi
        .spyOn(service, 'logError')
        .mockImplementation(() => undefined);
      const handler = service.logErrorHandler('test msg');
      handler('error');
      expect(logSpy).toHaveBeenCalledWith('error', 'test msg', undefined);
    });
  });
});
