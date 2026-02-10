import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
	BaseMeetingService,
	validateMeetingRequest,
	getMeetingIdFromDate,
	getToday,
	getDateFromScrumId,
} from './meeting.service';
import { SneatApiService } from '@sneat/api';
import {
	IMeetingTimerRequest,
	IMemberTimerRequest,
	TimerOperationEnum,
} from '../timer';

// Mock implementation of BaseMeetingService for testing
class TestMeetingService extends BaseMeetingService {
	constructor(sneatApiService: SneatApiService) {
		super('test-meeting', sneatApiService);
	}
}

describe('validateMeetingRequest', () => {
	it('should throw error when request is null', () => {
		return new Promise<void>((resolve, reject) => {
			validateMeetingRequest(null as any).subscribe({
				error: (err) => {
					try {
						expect(err).toBe('request parameter is required');
						resolve();
					} catch (e) {
						reject(e);
					}
				},
			});
		});
	});

	it('should throw error when request is undefined', () => {
		return new Promise<void>((resolve, reject) => {
			validateMeetingRequest(undefined as any).subscribe({
				error: (err) => {
					try {
						expect(err).toBe('request parameter is required');
						resolve();
					} catch (e) {
						reject(e);
					}
				},
			});
		});
	});

	it('should throw error when operation is missing', () => {
		const request = {
			spaceID: 'space1',
			meeting: 'meeting1',
		} as IMeetingTimerRequest;

		return new Promise<void>((resolve, reject) => {
			validateMeetingRequest(request).subscribe({
				error: (err) => {
					try {
						expect(err).toBe('operation parameter is required');
						resolve();
					} catch (e) {
						reject(e);
					}
				},
			});
		});
	});

	it('should throw error when spaceID is missing', () => {
		const request = {
			operation: TimerOperationEnum.start,
			meeting: 'meeting1',
		} as IMeetingTimerRequest;

		return new Promise<void>((resolve, reject) => {
			validateMeetingRequest(request).subscribe({
				error: (err) => {
					try {
						expect(err).toBe('space parameter is required');
						resolve();
					} catch (e) {
						reject(e);
					}
				},
			});
		});
	});

	it('should throw error when meeting is missing', () => {
		const request = {
			operation: TimerOperationEnum.start,
			spaceID: 'space1',
		} as IMeetingTimerRequest;

		return new Promise<void>((resolve, reject) => {
			validateMeetingRequest(request).subscribe({
				error: (err) => {
					try {
						expect(err).toBe('meeting parameter is required');
						resolve();
					} catch (e) {
						reject(e);
					}
				},
			});
		});
	});

	it('should return EMPTY when all required parameters are present', () => {
		const request: IMeetingTimerRequest = {
			operation: TimerOperationEnum.start,
			spaceID: 'space1',
			meeting: 'meeting1',
		};

		return new Promise<void>((resolve, reject) => {
			let emitted = false;
			validateMeetingRequest(request).subscribe({
				next: () => {
					emitted = true;
				},
				complete: () => {
					try {
						expect(emitted).toBe(false);
						resolve();
					} catch (e) {
						reject(e);
					}
				},
			});
		});
	});
});

describe('BaseMeetingService', () => {
	let service: TestMeetingService;
	let mockApiService: jest.Mocked<SneatApiService>;

	beforeEach(() => {
		mockApiService = {
			post: vi.fn(),
		} as any;

		TestBed.configureTestingModule({
			providers: [
				{
					provide: SneatApiService,
					useValue: mockApiService,
				},
			],
		});

		service = new TestMeetingService(mockApiService);
	});

	describe('toggleMemberTimer', () => {
		it('should throw error when request is null', async () => {
			try {
				await service.toggleMemberTimer(null as any).toPromise();
				fail('Should have thrown an error');
			} catch (err) {
				expect(err).toBe('request parameter is required');
			}
		});

		it('should throw error when member is missing', async () => {
			const request = {
				operation: TimerOperationEnum.start,
				spaceID: 'space1',
				meeting: 'meeting1',
			} as IMemberTimerRequest;

			try {
				await service.toggleMemberTimer(request).toPromise();
				fail('Should have thrown an error');
			} catch (err) {
				expect(err).toBe('date parameter is required');
			}
		});

		it('should call API with correct endpoint and data when request is valid', (done) => {
			const request: IMemberTimerRequest = {
				operation: TimerOperationEnum.start,
				spaceID: 'space1',
				meeting: 'meeting1',
				member: 'user1',
			};

			const mockResponse = {
				timer: { status: 'active' },
				by: { uid: 'user1' },
			};

			mockApiService.post.mockReturnValue(of(mockResponse));

			service.toggleMemberTimer(request).subscribe({
				next: (response) => {
					expect(mockApiService.post).toHaveBeenCalledWith(
						'test-meeting/toggle_member_timer',
						request,
					);
					expect(response).toEqual(mockResponse);
					done();
				},
				error: done,
			});
		});

		it('should propagate API errors', (done) => {
			const request: IMemberTimerRequest = {
				operation: TimerOperationEnum.start,
				spaceID: 'space1',
				meeting: 'meeting1',
				member: 'user1',
			};

			mockApiService.post.mockReturnValue(throwError(() => 'API error'));

			service.toggleMemberTimer(request).subscribe({
				error: (err) => {
					expect(err).toBe('API error');
					done();
				},
			});
		});
	});

	describe('toggleMeetingTimer', () => {
		it('should throw error when request validation fails', (done) => {
			const request = {
				operation: TimerOperationEnum.start,
			} as IMeetingTimerRequest;

			service.toggleMeetingTimer(request).subscribe({
				error: (err) => {
					expect(err).toBeTruthy();
					done();
				},
			});
		});

		it('should call API with correct endpoint and data when request is valid', (done) => {
			const request: IMeetingTimerRequest = {
				operation: TimerOperationEnum.start,
				spaceID: 'space1',
				meeting: 'meeting1',
			};

			const mockResponse = {
				timer: { status: 'active' },
				by: { uid: 'user1' },
			};

			mockApiService.post.mockReturnValue(of(mockResponse));

			service.toggleMeetingTimer(request).subscribe({
				next: (response) => {
					expect(mockApiService.post).toHaveBeenCalledWith(
						'test-meeting/toggle_meeting_timer',
						request,
					);
					expect(response).toEqual(mockResponse);
					done();
				},
				error: done,
			});
		});

		it('should propagate API errors', (done) => {
			const request: IMeetingTimerRequest = {
				operation: TimerOperationEnum.start,
				spaceID: 'space1',
				meeting: 'meeting1',
			};

			mockApiService.post.mockReturnValue(throwError(() => 'API error'));

			service.toggleMeetingTimer(request).subscribe({
				error: (err) => {
					expect(err).toBe('API error');
					done();
				},
			});
		});
	});

	describe('meetingType property', () => {
		it('should return the correct meeting type', () => {
			expect(service.meetingType).toBe('test-meeting');
		});
	});
});

describe('getMeetingIdFromDate', () => {
	it('should format date as YYYY-MM-DD', () => {
		const date = new Date(2024, 0, 5); // January 5, 2024
		expect(getMeetingIdFromDate(date)).toBe('2024-01-05');
	});

	it('should pad single digit month', () => {
		const date = new Date(2024, 8, 15); // September 15, 2024
		expect(getMeetingIdFromDate(date)).toBe('2024-09-15');
	});

	it('should pad single digit day', () => {
		const date = new Date(2024, 11, 9); // December 9, 2024
		expect(getMeetingIdFromDate(date)).toBe('2024-12-09');
	});

	it('should handle double digit month and day', () => {
		const date = new Date(2024, 11, 25); // December 25, 2024
		expect(getMeetingIdFromDate(date)).toBe('2024-12-25');
	});

	it('should handle first day of year', () => {
		const date = new Date(2024, 0, 1); // January 1, 2024
		expect(getMeetingIdFromDate(date)).toBe('2024-01-01');
	});

	it('should handle last day of year', () => {
		const date = new Date(2024, 11, 31); // December 31, 2024
		expect(getMeetingIdFromDate(date)).toBe('2024-12-31');
	});
});

describe('getToday', () => {
	it('should return date with time set to midnight', () => {
		const today = getToday();
		expect(today.getHours()).toBe(0);
		expect(today.getMinutes()).toBe(0);
		expect(today.getSeconds()).toBe(0);
		expect(today.getMilliseconds()).toBe(0);
	});

	it('should return a Date object', () => {
		const today = getToday();
		expect(today).toBeInstanceOf(Date);
	});

	it('should return current date', () => {
		const today = getToday();
		const now = new Date();
		expect(today.getFullYear()).toBe(now.getFullYear());
		expect(today.getMonth()).toBe(now.getMonth());
		expect(today.getDate()).toBe(now.getDate());
	});
});

describe('getDateFromScrumId', () => {
	it('should parse YYYY-MM-DD format', () => {
		const date = getDateFromScrumId('2024-01-15');
		expect(date.getFullYear()).toBe(2024);
		expect(date.getMonth()).toBe(0); // January is 0
		expect(date.getDate()).toBe(15);
	});

	it('should handle different dates', () => {
		const date = getDateFromScrumId('2023-12-25');
		expect(date.getFullYear()).toBe(2023);
		expect(date.getMonth()).toBe(11); // December is 11
		expect(date.getDate()).toBe(25);
	});

	it('should create valid Date object', () => {
		const date = getDateFromScrumId('2024-06-30');
		expect(date).toBeInstanceOf(Date);
		expect(date.toString()).not.toBe('Invalid Date');
	});
});
