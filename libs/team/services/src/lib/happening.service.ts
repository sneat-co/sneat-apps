import { Inject, Injectable, NgModule } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IFilter, SneatApiService } from '@sneat/api';
import { dateToIso } from '@sneat/core';
import {
	HappeningStatus,
	IHappeningBrief,
	IHappeningDto,
	IHappeningSlot,
	validateHappeningDto,
	WeekdayCode2,
} from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IHappeningContext,
	ITeamContext,
	ITeamRequest,
} from '@sneat/team-models';
import { map, Observable, tap, throwError } from 'rxjs';
import { GlobalTeamItemService } from './team-item.service';

export interface ICreateHappeningRequest {
	teamID: string;
	happening: IHappeningDto;
}

export interface IHappeningRequest extends ITeamRequest {
	happeningID: string;
	happeningType?: string;
}

export interface IHappeningMemberRequest extends ITeamRequest {
	happeningID: string;
	contactID: string;
}

export interface IHappeningSlotRequest extends IHappeningRequest {
	slot: IHappeningSlot;
}

export interface IHappeningSlotDateRequest extends IHappeningSlotRequest {
	date?: string;
}

export interface ISlotsRefRequest extends IHappeningRequest {
	date?: string;
	slotIDs?: string[];
}

export interface ISlotRequest extends IHappeningRequest {
	date?: string;
	slotID?: string;
	weekday?: WeekdayCode2;
	reason?: string;
}

export type IDeleteSlotRequest = ISlotRequest;

export type ICancelHappeningRequest = ISlotRequest;

function processHappeningContext(
	h: IHappeningContext,
	team: ITeamContext,
): IHappeningContext {
	if (h.dto) {
		try {
			validateHappeningDto(h.dto);
		} catch (e) {
			console.warn(`Received invalid happening DTO (id=${h.id}: ${e}`);
		}
	}
	if (!h.team && team) {
		h = { ...h, team };
	}
	return h;
}

@Injectable()
export class HappeningService {
	private readonly teamItemService: GlobalTeamItemService<
		IHappeningBrief,
		IHappeningDto
	>;

	static statusFilter(statuses: HappeningStatus[]): IFilter {
		const operator = statuses?.length === 1 ? '==' : 'in';
		const value = statuses.length === 1 ? statuses[0] : statuses;
		return { field: 'status', operator, value };
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		afs: AngularFirestore,
		private readonly sneatApiService: SneatApiService,
	) {
		this.teamItemService = new GlobalTeamItemService(
			'happenings',
			afs,
			sneatApiService,
		);
	}

	public createHappening(
		request: ICreateHappeningRequest,
	): Observable<unknown> {
		const title = request.happening.title.trim();
		if (title !== request.happening.title) {
			request = {
				...request,
				happening: {
					...request.happening,
					title,
				},
			};
		}
		request = {
			...request,
			happening: {
				...request.happening,
				assetIDs: ['*'], // This is required but will be ignored
				contactIDs: ['*'], // This is required but will be ignored
			},
		};
		try {
			validateHappeningDto(request.happening);
		} catch (e) {
			return throwError(() => e);
		}
		return this.sneatApiService.post('happenings/create_happening', request);
	}

	public cancelHappening(request: ICancelHappeningRequest): Observable<void> {
		return this.sneatApiService.post('happenings/cancel_happening', request);
	}

	public revokeHappeningCancellation(
		request: ICancelHappeningRequest,
	): Observable<void> {
		return this.sneatApiService.post(
			'happenings/revoke_happening_cancellation',
			request,
		);
	}

	public deleteHappening(happening: IHappeningContext): Observable<void> {
		console.log('deleteHappening', happening);
		const request: IHappeningRequest = {
			teamID: happening.team?.id || '',
			happeningID: happening.id,
			happeningType: happening.brief?.type || happening.dto?.type,
		};
		return this.sneatApiService.delete(
			'happenings/delete_happening',
			undefined,
			request,
		);
	}

	public deleteSlots(request: ISlotRequest): Observable<void> {
		console.log('deleteSlots', request);
		// const qp = new HttpParams();
		// qp.set('team', request.teamID)
		// qp.set('happening', request.happeningID)
		// if (request.slotIDs?.length === 1) {
		// 	qp.set('happening', request.slotIDs[0])
		// }
		return this.sneatApiService.delete(
			'happenings/delete_slots',
			undefined,
			request,
		);
	}

	public removeParticipant(request: IHappeningMemberRequest): Observable<void> {
		return this.sneatApiService.post('happenings/remove_participant', request);
	}

	public addParticipant(request: IHappeningMemberRequest): Observable<void> {
		return this.sneatApiService.post('happenings/add_participant', request);
	}

	public updateSlot(
		teamID: string,
		happeningID: string,
		slot: IHappeningSlot,
	): Observable<void> {
		const request: IHappeningSlotRequest = {
			teamID,
			happeningID,
			slot,
		};
		return this.sneatApiService.post('happenings/update_slot', request);
	}

	public adjustSlot(
		teamID: string,
		happeningID: string,
		slot: IHappeningSlot,
		date: string,
	): Observable<void> {
		slot = {
			repeats: 'once',
			id: slot.id,
			start: { ...slot.start, date },
			end: slot.end,
			durationMinutes: slot.durationMinutes,
		};
		const request: IHappeningSlotDateRequest = {
			teamID,
			happeningID,
			slot,
			date,
		};
		return this.sneatApiService.post('happenings/adjust_slot', request);
	}

	// watchByTeam(team: ITeamContext): Observable<IHappeningContext[]> {
	// 	return this.sfs.watchByTeamID(team.id);
	// }

	public watchHappeningByID(
		team: ITeamContext,
		id: string,
	): Observable<IHappeningContext> {
		return this.teamItemService
			.watchTeamItemByIdWithTeamRef(team, id)
			.pipe(map((h) => processHappeningContext(h, team)));
	}

	public watchUpcomingSingles(
		team: ITeamContext,
		statuses: HappeningStatus[] = ['active'],
	): Observable<IHappeningContext[]> {
		const date = dateToIso(new Date());
		return this.teamItemService
			.watchGlobalTeamItemsWithTeamRef(team, [
				HappeningService.statusFilter(statuses),
				{ field: 'dateMin', operator: '>=', value: date },
			])
			.pipe(
				map((happenings) => {
					return happenings.map((h) => processHappeningContext(h, team));
				}),
			);
	}

	public watchSinglesOnSpecificDay(
		team: ITeamContext,
		date: string,
		statuses: HappeningStatus[] = ['active'],
	): Observable<IHappeningContext[]> {
		if (!team.id) {
			return throwError(() => 'missing required field "teamID"');
		}
		if (!date) {
			return throwError(() => 'missing required field "date"');
		}
		console.log('watchSinglesOnSpecificDay()', team.id, date, statuses);
		const teamDate = team.id + ':' + date;
		return this.teamItemService
			.watchGlobalTeamItemsWithTeamRef(team, [
				{ field: 'teamDates', operator: 'array-contains', value: teamDate },
				HappeningService.statusFilter(statuses),
			])
			.pipe(
				tap((happenings) => {
					console.log(
						'watchSinglesOnSpecificDay() =>',
						team.id,
						date,
						statuses,
						happenings,
					);
				}),
				map((happenings) =>
					happenings.map((h) => processHappeningContext(h, team)),
				),
			);
	}
}

@NgModule({
	providers: [HappeningService],
})
export class HappeningServiceModule {}
