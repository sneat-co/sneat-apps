import { MultiAnalyticsService } from './multi-analytics.service';
import { IAnalyticsService } from '../../../../core/src/lib/analytics.interface';

describe('MultiAnalyticsService', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be created', () => {
		const service = new MultiAnalyticsService([]);
		expect(service).toBeTruthy();
	});

	it('should call all analytics services on logEvent', () => {
		const mockService: IAnalyticsService = {
			logEvent: vi.fn(),
			identify: vi.fn(),
			loggedOut: vi.fn(),
			setCurrentScreen: vi.fn(),
		};
		const service = new MultiAnalyticsService([mockService]);
		service.logEvent('test_event');
		// logEvent uses setTimeout in MultiAnalyticsService
		vi.runAllTimers();
		expect(mockService.logEvent).toHaveBeenCalledWith(
			'test_event',
			undefined,
			undefined,
		);
	});
});
