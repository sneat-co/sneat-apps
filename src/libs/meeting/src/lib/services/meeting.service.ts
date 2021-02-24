import {Observable, throwError} from 'rxjs';
import {IMeetingTimerRequest, IMeetingTimerService, IMemberTimerRequest, ITimerResponse} from '@sneat/timer';
import {SneatTeamApiService} from '@sneat/api';

export const validateMeetingRequest: (request: IMeetingTimerRequest) => Observable<never> = request => {
	if (!request) {
		return throwError('request parameter is required');
	}
	if (!request.operation) {
		return throwError('operation parameter is required');
	}
	if (!request.team) {
		return throwError('team parameter is required');
	}
	if (!request.meeting) {
		return throwError('meeting parameter is required');
	}
}

export abstract class BaseMeetingService implements IMeetingTimerService {
	protected constructor(
		public readonly meetingType: string,
		protected readonly sneatTeamApiService: SneatTeamApiService,
	) {
	}

	public readonly toggleMemberTimer = (request: IMemberTimerRequest): Observable<ITimerResponse> =>
		!request && throwError('request parameter is required')
		|| !request?.member && throwError('date parameter is required')
		|| this.toggleTimer(request, 'toggle_member_timer');

	public readonly toggleMeetingTimer = (request: IMeetingTimerRequest): Observable<ITimerResponse> =>
		this.toggleTimer(request, 'toggle_meeting_timer');

	private toggleTimer(request: IMeetingTimerRequest, endpoint: 'toggle_meeting_timer' | 'toggle_member_timer'):
		Observable<ITimerResponse> {
		return validateMeetingRequest(request)
			|| this.sneatTeamApiService.post<ITimerResponse>(`${this.meetingType}/${endpoint}`, request);
	}
}

export const getMeetingIdFromDate = (date: Date) => {
	const m = `` + (date.getMonth() + 1);
	const d = `` + date.getDate();
	return `${date.getFullYear()}-${m.length === 2 ? m : '0' + m}-${d.length === 2 ? d : '0' + d}`
}

export const getToday = () => {
	const d = new Date();
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export const getDateFromScrumId = (id: string) => new Date(id)
