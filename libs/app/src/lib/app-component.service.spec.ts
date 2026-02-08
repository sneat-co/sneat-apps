import { AppComponentService } from './app-component.service';

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

		service = Object.create(AppComponentService.prototype);
		(service as any).platform = platformMock;
		(service as any).errorLogger = errorLoggerMock;
		(service as any).splashScreen = splashScreenMock;
		(service as any).statusBar = statusBarMock;
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should initialize app', async () => {
		service.initializeApp();
		await platformMock.ready();
		expect(platformMock.ready).toHaveBeenCalled();
		expect(statusBarMock.styleDefault).toHaveBeenCalled();
		expect(splashScreenMock.hide).toHaveBeenCalled();
	});
});
