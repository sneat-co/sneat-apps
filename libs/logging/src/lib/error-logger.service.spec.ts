import { TestBed } from '@angular/core/testing';
import { ErrorLoggerService } from './error-logger.service';
import { ToastController } from '@ionic/angular/standalone';
import { captureException, showReportDialog } from '@sentry/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Mock } from 'vitest';

vi.mock('@sentry/angular', () => ({
  captureException: vi.fn().mockImplementation((...args: any[]) => {
    console.log('MOCK captureException CALLED with', args);
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
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
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
      console.log('window.location.hostname:', window.location.hostname);
      service.logError(new Error('test'), 'msg', { report: true });
      expect(captureException).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it('should show error toast by default', () => {
      service.logError(new Error('test'));
      expect(toastController.create).toHaveBeenCalled();
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
  });

  describe('logErrorHandler', () => {
    it('should return a function that calls logError', () => {
      const logSpy = vi.spyOn(service, 'logError').mockImplementation(() => undefined);
      const handler = service.logErrorHandler('test msg');
      handler('error');
      expect(logSpy).toHaveBeenCalledWith('error', 'test msg', undefined);
    });
  });
});
