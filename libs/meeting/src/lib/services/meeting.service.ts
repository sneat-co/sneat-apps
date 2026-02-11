import { EMPTY, Observable, throwError } from 'rxjs';
import {
  IMeetingTimerRequest,
  IMeetingTimerService,
  IMemberTimerRequest,
  ITimerResponse,
} from '../timer';
import { SneatApiService } from '@sneat/api';

export const validateMeetingRequest: (
  request: IMeetingTimerRequest,
) => Observable<never> = (request) => {
  if (!request) {
    return throwError(() => 'request parameter is required');
  }
  if (!request.operation) {
    return throwError(() => 'operation parameter is required');
  }
  if (!request.spaceID) {
    return throwError(() => 'space parameter is required');
  }
  if (!request.meeting) {
    return throwError(() => 'meeting parameter is required');
  }
  return EMPTY;
};

export abstract class BaseMeetingService implements IMeetingTimerService {
  protected constructor(
    public readonly meetingType: string,
    protected readonly sneatApiService: SneatApiService,
  ) {}

  public readonly toggleMemberTimer = (
    request: IMemberTimerRequest,
  ): Observable<ITimerResponse> =>
    (!request && throwError(() => 'request parameter is required')) ||
    (!request?.member && throwError(() => 'date parameter is required')) ||
    this.toggleTimer(request, 'toggle_member_timer');

  public readonly toggleMeetingTimer = (
    request: IMeetingTimerRequest,
  ): Observable<ITimerResponse> =>
    this.toggleTimer(request, 'toggle_meeting_timer');

  private toggleTimer(
    request: IMeetingTimerRequest,
    endpoint: 'toggle_meeting_timer' | 'toggle_member_timer',
  ): Observable<ITimerResponse> {
    const validationError = this.validateRequest(request);
    if (validationError) {
      return throwError(() => validationError);
    }
    return this.sneatApiService.post<ITimerResponse>(
      `${this.meetingType}/${endpoint}`,
      request,
    );
  }

  /**
   * Validates a meeting timer request.
   *
   * @param request - The meeting timer request to validate
   * @returns An error message if validation fails, null otherwise
   */
  private validateRequest(request: IMeetingTimerRequest): string | null {
    if (!request) {
      return 'request parameter is required';
    }
    if (!request.operation) {
      return 'operation parameter is required';
    }
    if (!request.spaceID) {
      return 'space parameter is required';
    }
    if (!request.meeting) {
      return 'meeting parameter is required';
    }
    return null;
  }
}

export const getMeetingIdFromDate = (date: Date) => {
  const m = `` + (date.getMonth() + 1);
  const d = `` + date.getDate();
  return `${date.getFullYear()}-${m.length === 2 ? m : '0' + m}-${
    d.length === 2 ? d : '0' + d
  }`;
};

export const getToday = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const getDateFromScrumId = (id: string) => new Date(id);
