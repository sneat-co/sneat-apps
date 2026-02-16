/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import {
  AppComponentService,
  SplashScreen,
  StatusBar,
} from './app-component.service';

describe('AppComponentService', () => {
  let service: AppComponentService;
  let platformMock: any;
  let errorLoggerMock: any;
  let splashScreenMock: any;
  let statusBarMock: any;

  beforeEach(() => {
    platformMock = { ready: vi.fn().mockResolvedValue('ready') };
    errorLoggerMock = {
      logError: vi.fn(),
      logErrorHandler: vi.fn(() => vi.fn()),
    };
    splashScreenMock = { hide: vi.fn() };
    statusBarMock = { styleDefault: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AppComponentService,
        { provide: Platform, useValue: platformMock },
        { provide: ErrorLogger, useValue: errorLoggerMock },
        { provide: SplashScreen, useValue: splashScreenMock },
        { provide: StatusBar, useValue: statusBarMock },
      ],
    });
  });

  it('should be created via constructor with injections', () => {
    service = TestBed.inject(AppComponentService);
    expect(service).toBeTruthy();
  });

  it('should initialize app with statusBar and splashScreen', async () => {
    service = TestBed.inject(AppComponentService);
    service.initializeApp();
    await platformMock.ready();
    expect(platformMock.ready).toHaveBeenCalled();
    expect(statusBarMock.styleDefault).toHaveBeenCalled();
    expect(splashScreenMock.hide).toHaveBeenCalled();
  });

  it('should skip statusBar when it is not provided', async () => {
    TestBed.overrideProvider(StatusBar, { useValue: null });
    service = TestBed.inject(AppComponentService);

    service.initializeApp();
    await platformMock.ready();

    expect(splashScreenMock.hide).toHaveBeenCalled();
  });

  it('should skip splashScreen when it is not provided', async () => {
    TestBed.overrideProvider(SplashScreen, { useValue: null });
    service = TestBed.inject(AppComponentService);

    service.initializeApp();
    await platformMock.ready();

    expect(statusBarMock.styleDefault).toHaveBeenCalled();
  });

  it('should handle errors during platform initialization', async () => {
    service = TestBed.inject(AppComponentService);
    const error = new Error('Test error');
    statusBarMock.styleDefault.mockImplementation(() => {
      throw error;
    });

    service.initializeApp();
    await platformMock.ready();

    expect(errorLoggerMock.logError).toHaveBeenCalledWith(
      error,
      'failed to handle "platform_ready" event',
    );
  });

  it('should handle platform.ready() rejection', async () => {
    const error = new Error('Platform error');
    platformMock.ready.mockRejectedValue(error);
    const errorHandlerMock = vi.fn();
    errorLoggerMock.logErrorHandler.mockReturnValue(errorHandlerMock);

    service = TestBed.inject(AppComponentService);
    service.initializeApp();

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(errorLoggerMock.logErrorHandler).toHaveBeenCalledWith(
      'Failed to initialize Platform@ionic/angular',
    );
    expect(errorHandlerMock).toHaveBeenCalledWith(error);
  });
});
