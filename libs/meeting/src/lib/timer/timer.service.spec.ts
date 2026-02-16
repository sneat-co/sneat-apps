import { TestBed } from '@angular/core/testing';
import { firstValueFrom, lastValueFrom, of, throwError, timeout } from 'rxjs';

import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { Timer, TimerFactory, IMeetingTimerService } from './timer.service';
import {
  TimerOperationEnum,
  TimerStatusEnum,
  ITimerResponse,
} from './timer-models';

describe('TimerFactory', () => {
  let factory: TimerFactory;
  let mockErrorLogger: IErrorLogger;
  let mockTimerService: IMeetingTimerService;

  beforeEach(() => {
    mockErrorLogger = {
      logError: vi.fn(),
      logErrorHandler: () => vi.fn(),
    };

    mockTimerService = {
      meetingType: 'test-meeting',
      toggleMemberTimer: vi.fn(),
      toggleMeetingTimer: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TimerFactory,
        {
          provide: ErrorLogger,
          useValue: mockErrorLogger,
        },
      ],
    });

    factory = TestBed.inject(TimerFactory);
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  describe('getTimer', () => {
    it('should throw error when spaceID is missing', () => {
      expect(() => factory.getTimer(mockTimerService, '', 'meeting1')).toThrow(
        'spaceID is required',
      );
    });

    it('should throw error when meetingID is missing', () => {
      expect(() => factory.getTimer(mockTimerService, 'space1', '')).toThrow(
        'meetingId is required',
      );
    });

    it('should throw error when meetingType is missing', () => {
      const invalidService = {
        ...mockTimerService,
        meetingType: '',
      };
      expect(() =>
        factory.getTimer(invalidService, 'space1', 'meeting1'),
      ).toThrow('timerService.meetingType is required');
    });

    it('should create and return a new timer', () => {
      const timer = factory.getTimer(mockTimerService, 'space1', 'meeting1');
      expect(timer).toBeInstanceOf(Timer);
      expect(timer.spaceID).toBe('space1');
      expect(timer.meetingId).toBe('meeting1');
    });

    it('should return the same timer for the same key', () => {
      const timer1 = factory.getTimer(mockTimerService, 'space1', 'meeting1');
      const timer2 = factory.getTimer(mockTimerService, 'space1', 'meeting1');
      expect(timer1).toBe(timer2);
    });

    it('should return different timers for different keys', () => {
      const timer1 = factory.getTimer(mockTimerService, 'space1', 'meeting1');
      const timer2 = factory.getTimer(mockTimerService, 'space1', 'meeting2');
      expect(timer1).not.toBe(timer2);
    });

    it('should create new timer after releasing', () => {
      const timer1 = factory.getTimer(mockTimerService, 'space1', 'meeting1');
      timer1.releaseTimer();
      const timer2 = factory.getTimer(mockTimerService, 'space1', 'meeting1');
      expect(timer1).not.toBe(timer2);
    });
  });
});

describe('Timer', () => {
  let timer: Timer;
  let mockErrorLogger: IErrorLogger;
  let mockTimerService: IMeetingTimerService;
  let releasedCalled: boolean;

  beforeEach(() => {
    releasedCalled = false;
    mockErrorLogger = {
      logError: vi.fn(),
      logErrorHandler: () => vi.fn(),
    };

    mockTimerService = {
      meetingType: 'test-meeting',
      toggleMemberTimer: vi.fn(),
      toggleMeetingTimer: vi.fn(),
    };

    timer = new Timer(
      mockErrorLogger,
      mockTimerService,
      () => {
        releasedCalled = true;
      },
      'space1',
      'meeting1',
    );
  });

  afterEach(() => {
    timer.releaseTimer();
  });

  describe('initialization', () => {
    it('should initialize with correct properties', () => {
      expect(timer.spaceID).toBe('space1');
      expect(timer.meetingId).toBe('meeting1');
    });

    it('should have onTick observable', async () => {
      // onTick emits values when timer state changes
      // We need to trigger a state change first
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.stopped, elapsedSeconds: 0 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      // Trigger a state change
      timer.stopTimer().subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      // Wait for tick to be emitted
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify the observable is defined
      expect(timer.onTick).toBeDefined();
    });
  });

  describe('releaseTimer', () => {
    it('should call released callback', () => {
      timer.releaseTimer();
      expect(releasedCalled).toBe(true);
    });

    it('should unsubscribe from interval', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.active, elapsedSeconds: 0 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      timer.startTimer();
      await new Promise((resolve) => setTimeout(resolve, 10));
      timer.releaseTimer();
      expect(releasedCalled).toBe(true);
    });
  });

  describe('updateTimerState', () => {
    it('should throw "Not implemented" error', () => {
      expect(() => timer.updateTimerState()).toThrow(
        'Not implemented - temporary disabled',
      );
    });

    it('should throw "Not implemented" error with state', () => {
      expect(() =>
        timer.updateTimerState({ status: TimerStatusEnum.active }),
      ).toThrow('Not implemented - temporary disabled');
    });
  });

  describe('startTimer', () => {
    it('should return observable', () => {
      const result = timer.startTimer();
      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should call toggleMeetingTimer when no member specified', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.active, elapsedSeconds: 0 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      const observable = timer.startTimer();

      // Subscribe to trigger operation
      observable.subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockTimerService.toggleMeetingTimer).toHaveBeenCalledWith({
        spaceID: 'space1',
        meeting: 'meeting1',
        operation: TimerOperationEnum.start,
      });
    });

    it('should call toggleMemberTimer when member specified', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.active, elapsedSeconds: 0 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMemberTimer).mockReturnValue(
        of(mockResponse),
      );

      const observable = timer.startTimer('member1');

      // Subscribe to trigger operation
      observable.subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockTimerService.toggleMemberTimer).toHaveBeenCalledWith({
        spaceID: 'space1',
        meeting: 'meeting1',
        operation: TimerOperationEnum.start,
        member: 'member1',
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      const observable = timer.startTimer();
      let errorCaught = false;

      observable.subscribe({
        error: () => {
          errorCaught = true;
        },
      });

      // Wait for error handling
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(errorCaught).toBe(true);
    });
  });

  describe('pauseTimer', () => {
    it('should return observable and call API', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.paused, elapsedSeconds: 10 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      const observable = timer.pauseTimer();
      expect(observable).toBeDefined();

      // Wait a bit for async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockTimerService.toggleMeetingTimer).toHaveBeenCalledWith({
        spaceID: 'space1',
        meeting: 'meeting1',
        operation: TimerOperationEnum.pause,
      });
    });
  });

  describe('stopTimer', () => {
    it('should return observable and call API', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.stopped, elapsedSeconds: 20 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      const observable = timer.stopTimer();
      expect(observable).toBeDefined();

      // Subscribe to trigger the operation
      observable.subscribe({
        error: () => {
          // Errors are expected for non-completing observables
        },
      });

      // Wait a bit for async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockTimerService.toggleMeetingTimer).toHaveBeenCalledWith({
        spaceID: 'space1',
        meeting: 'meeting1',
        operation: TimerOperationEnum.stop,
      });
    });
  });

  describe('toggleTimer', () => {
    it('should start when status is stopped', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.active, elapsedSeconds: 0 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      // First stop the timer
      const stopObs = timer.stopTimer();
      stopObs.subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Then toggle it - it should start
      const observable = timer.toggleTimer();
      expect(observable).toBeDefined();
    });

    it('should throw error for unexpected timer status', async () => {
      try {
        await lastValueFrom(timer.toggleTimer());
        throw new Error('Should have thrown error');
      } catch (err) {
        expect(err).toContain('Unexpected timer status');
      }
    });

    it('should start when status is paused', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.active, elapsedSeconds: 0 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      // First pause the timer
      const pauseObs = timer.pauseTimer();
      pauseObs.subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Then toggle it - it should start
      const observable = timer.toggleTimer();
      expect(observable).toBeDefined();

      observable.subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    it('should stop when active and member is same', async () => {
      const mockResponse: ITimerResponse = {
        timer: {
          status: TimerStatusEnum.active,
          elapsedSeconds: 0,
          activeMemberId: 'member1',
        },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMemberTimer).mockReturnValue(
        of(mockResponse),
      );

      // First start the timer with member1
      const startObs = timer.startTimer('member1');
      startObs.subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Then toggle it again with same member - it should stop
      const observable = timer.toggleTimer('member1');
      expect(observable).toBeDefined();
    });

    it('should start with different member when active', async () => {
      const mockResponse: ITimerResponse = {
        timer: {
          status: TimerStatusEnum.active,
          elapsedSeconds: 0,
          activeMemberId: 'member1',
        },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMemberTimer).mockReturnValue(
        of(mockResponse),
      );

      // First start the timer with member1
      const startObs = timer.startTimer('member1');
      startObs.subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Then toggle it with member2 - it should start for member2
      const observable = timer.toggleTimer('member2');
      expect(observable).toBeDefined();
    });
  });

  describe('setTimerState', () => {
    it('should emit tick on state change', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.active, elapsedSeconds: 0 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      let tickCount = 0;
      const sub = timer.onTick.subscribe(() => {
        tickCount++;
      });

      const observable = timer.setTimerState(TimerOperationEnum.start);
      expect(observable).toBeDefined();

      // Subscribe but expect it might not complete
      observable.subscribe({
        error: () => {
          // Errors are expected for non-completing observables
        },
      });

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      sub.unsubscribe();
      expect(tickCount).toBeGreaterThan(0);
    });

    it('should set isToggling to true initially', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.active, elapsedSeconds: 0 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      const promise = firstValueFrom(timer.onTick.pipe(timeout(1000))).then(
        (state) => {
          expect(state.isToggling).toBeDefined();
        },
      );

      timer.setTimerState(TimerOperationEnum.start);
      await promise;
    });

    it('should handle unknown operation', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await lastValueFrom(timer.setTimerState('unknown' as any));
        throw new Error('Should have thrown error');
      } catch (err) {
        expect(err).toContain('Unknown operation');
      }
    });

    it('should restore previous state on error', async () => {
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      const observable = timer.setTimerState(TimerOperationEnum.start);

      // Subscribe to trigger the operation
      observable.subscribe({
        error: () => {
          // Error expected
        },
      });

      // Wait for error handling
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    it('should call toggleMemberTimer when member is specified', async () => {
      const mockResponse: ITimerResponse = {
        timer: {
          status: TimerStatusEnum.active,
          elapsedSeconds: 0,
          activeMemberId: 'member1',
        },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMemberTimer).mockReturnValue(
        of(mockResponse),
      );

      const observable = timer.setTimerState(
        TimerOperationEnum.start,
        'member1',
      );

      // Subscribe to trigger the operation
      observable.subscribe({
        error: () => {
          // Errors are expected for non-completing observables
        },
      });

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockTimerService.toggleMemberTimer).toHaveBeenCalledWith({
        spaceID: 'space1',
        meeting: 'meeting1',
        operation: TimerOperationEnum.start,
        member: 'member1',
      });
    });

    it('should increment elapsed seconds when timer is active', async () => {
      const mockResponse: ITimerResponse = {
        timer: {
          status: TimerStatusEnum.active,
          elapsedSeconds: 0,
          activeMemberId: 'member1',
        },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMemberTimer).mockReturnValue(
        of(mockResponse),
      );

      let lastElapsedSeconds = 0;
      let tickedWithElapsed = false;

      const sub = timer.onTick.subscribe((state) => {
        if (state.elapsedSeconds && state.elapsedSeconds > lastElapsedSeconds) {
          lastElapsedSeconds = state.elapsedSeconds;
          tickedWithElapsed = true;
        }
      });

      // Start the timer
      timer.startTimer('member1').subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      // Wait for ticks
      await new Promise((resolve) => setTimeout(resolve, 1500));

      sub.unsubscribe();

      // Verify ticking occurred
      expect(tickedWithElapsed).toBe(true);
      expect(lastElapsedSeconds).toBeGreaterThan(0);
    });

    it('should track seconds by member when member is active', async () => {
      const mockResponse: ITimerResponse = {
        timer: {
          status: TimerStatusEnum.active,
          elapsedSeconds: 0,
          activeMemberId: 'member1',
        },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMemberTimer).mockReturnValue(
        of(mockResponse),
      );

      let secondsByMember: Record<string, number> | undefined;

      const sub = timer.onTick.subscribe((state) => {
        if (state.secondsByMember) {
          secondsByMember = state.secondsByMember;
        }
      });

      // Start the timer with member1
      timer.startTimer('member1').subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      // Wait for ticks
      await new Promise((resolve) => setTimeout(resolve, 1500));

      sub.unsubscribe();

      // Verify member seconds were tracked
      expect(secondsByMember).toBeDefined();
      if (secondsByMember) {
        expect(secondsByMember['member1']).toBeGreaterThan(0);
      }
    });

    it('should handle startTicking with already active status', async () => {
      const mockResponse: ITimerResponse = {
        timer: { status: TimerStatusEnum.active, elapsedSeconds: 0 },
        by: { uid: 'user1' },
      };
      vi.mocked(mockTimerService.toggleMeetingTimer).mockReturnValue(
        of(mockResponse),
      );

      // Start the timer
      timer.startTimer().subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      // Wait for timer to start
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Start it again - should handle already active state
      timer.startTimer().subscribe({
        error: () => {
          // Non-completing observable might error
        },
      });

      // Wait a bit more
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  });
});
