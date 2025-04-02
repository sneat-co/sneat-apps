import { Inject, Injectable, NgModule } from '@angular/core';
import {
	Firestore as AngularFirestore,
	orderBy,
} from '@angular/fire/firestore';
import { IFilter, SneatApiService } from '@sneat/api';
import { dateToIso } from '@sneat/core';
import {
	HappeningStatus,
	IHappeningBrief,
	IHappeningDbo,
	validateHappeningDto,
	WeekdayCode2,
	IHappeningContext,
	IHappeningPrice,
	IHappeningSlotWithID,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext, SpaceRequest } from '@sneat/space-models';
import { QueryOrderByConstraint } from 'firebase/firestore';
import { map, Observable, tap, throwError } from 'rxjs';
import { ModuleSpaceItemService } from '@sneat/space-services';

export interface ICreateHappeningRequest {
	readonly spaceID: string;
	readonly happening: IHappeningDbo;
}

export interface IHappeningRequest extends SpaceRequest {
	readonly happeningID: string;
	readonly happeningType?: string;
}

export interface ISpaceModuleDocShortRef {
	readonly id: string;
	readonly spaceID?: string;
}

export interface IHappeningContactRequest extends SpaceRequest {
	readonly happeningID: string;
	readonly contact: ISpaceModuleDocShortRef;
}

export interface IHappeningContactsRequest extends SpaceRequest {
	readonly happeningID: string;
	readonly contacts: readonly ISpaceModuleDocShortRef[];
}

export interface IHappeningSlotRequest extends IHappeningRequest {
	readonly slot: IHappeningSlotWithID;
}

export interface IHappeningPricesRequest extends IHappeningRequest {
	readonly prices: readonly IHappeningPrice[];
}

export interface IDeleteHappeningPricesRequest extends IHappeningRequest {
	readonly priceIDs: readonly string[];
}

export interface IHappeningSlotDateRequest extends IHappeningSlotRequest {
	readonly date?: string;
}

export interface ISlotsRefRequest extends IHappeningRequest {
	readonly slotIDs?: readonly string[];
	readonly date?: string;
}

export interface ISlotRefRequest extends IHappeningRequest {
	readonly slotID: string;
}

export interface ISlotRequest extends IHappeningRequest {
	readonly date?: string;
	readonly slotID?: string;
	readonly weekday?: WeekdayCode2;
	readonly reason?: string;
}

export interface IDeleteSlotRequest extends ISlotRefRequest {
	readonly reason?: string;
}

export type ICancelHappeningRequest = ISlotRequest;

function processHappeningContext(
	h: IHappeningContext,
	space: ISpaceContext,
): IHappeningContext {
	if (h.dbo) {
		try {
			validateHappeningDto(h.dbo);
		} catch (e) {
			console.warn(`Received invalid happening DTO (id=${h.id}: ${e}`);
		}
	}
	if (!h.space && space) {
		h = { ...h, space };
	}
	return h;
}

@Injectable()
export class HappeningService {
	private readonly spaceItemService: ModuleSpaceItemService<
		IHappeningBrief,
		IHappeningDbo
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
		this.spaceItemService = new ModuleSpaceItemService<
			IHappeningBrief,
			IHappeningDbo
		>('calendarium', 'happenings', afs, sneatApiService);
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
		if (
			request.happening.type === 'single' &&
			request.happening.slots &&
			Object.values(request.happening.slots).some(
				(slot) => slot.repeats !== 'once',
			)
		) {
			return throwError(
				() => 'Single occurrence happening cannot have recurring slots',
			);
		}
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
			spaceID: happening.space?.id || '',
			happeningID: happening.id,
			happeningType: happening.brief?.type || happening.dbo?.type,
		};
		return this.sneatApiService.delete(
			'happenings/delete_happening',
			undefined,
			request,
		);
	}

	public deleteSlot(request: IDeleteSlotRequest): Observable<void> {
		console.log('deleteSlot', request);
		return this.sneatApiService.delete(
			'happenings/delete_slot',
			undefined,
			request,
		);
	}

	public readonly removeParticipant = (
		request: IHappeningContactRequest,
	): Observable<void> => {
		return this.removeParticipants({
			spaceID: request.spaceID,
			happeningID: request.happeningID,
			contacts: [request.contact],
		});
	};
	public readonly removeParticipants = (
		request: IHappeningContactsRequest,
	): Observable<void> =>
		this.sneatApiService.post('happenings/remove_participants', request);

	public readonly addParticipant = (
		request: IHappeningContactRequest,
	): Observable<void> => {
		return this.addParticipants({
			spaceID: request.spaceID,
			happeningID: request.happeningID,
			contacts: [request.contact],
		});
	};
	public readonly addParticipants = (
		request: IHappeningContactsRequest,
	): Observable<void> =>
		this.sneatApiService.post('happenings/add_participants', request);

	public readonly addSlot = (
		spaceID: string,
		happeningID: string,
		slot: IHappeningSlotWithID,
	): Observable<void> => {
		const request: IHappeningSlotRequest = {
			spaceID,
			happeningID,
			slot,
		};
		return this.sneatApiService.post('happenings/add_slot', request);
	};

	public readonly updateSlot = (
		spaceID: string,
		happeningID: string,
		slot: IHappeningSlotWithID,
	): Observable<void> => {
		const request: IHappeningSlotRequest = {
			spaceID,
			happeningID,
			slot,
		};
		return this.sneatApiService.post('happenings/update_slot', request);
	};

	public deleteHappeningPrices(
		request: IDeleteHappeningPricesRequest,
	): Observable<void> {
		return this.sneatApiService.post('happenings/delete_prices', request);
	}

	public setHappeningPrices(
		request: IHappeningPricesRequest,
	): Observable<void> {
		return this.sneatApiService.post('happenings/set_prices', request);
	}

	public adjustSlot(
		spaceID: string,
		happeningID: string,
		slot: IHappeningSlotWithID,
		date: string,
	): Observable<void> {
		slot = {
			id: slot.id,
			repeats: 'once',
			start: { time: slot.start?.time || '', date },
			end: slot.end,
			durationMinutes: slot.durationMinutes,
		};
		const request: IHappeningSlotDateRequest = {
			spaceID: spaceID,
			happeningID,
			slot,
			date,
		};
		return this.sneatApiService.post('happenings/adjust_slot', request);
	}

	// watchByTeam(space: ISpaceContext): Observable<IHappeningContext[]> {
	// 	return this.sfs.watchBySpaceID(team.id);
	// }

	public watchHappeningByID(
		space: ISpaceContext,
		id: string,
	): Observable<IHappeningContext> {
		console.log(`watchHappeningByID(team.id=${space.id}, id=${id})`);
		return this.spaceItemService.watchSpaceItemByIdWithSpaceRef(space, id).pipe(
			tap((happening) => console.log('watchHappeningByID() =>', happening)),
			map((h) => processHappeningContext(h, space)),
		);
	}

	public watchUpcomingSingles(
		space: ISpaceContext,
		statuses: HappeningStatus[] = ['active'],
	): Observable<IHappeningContext[]> {
		return this.watchSingles(space, statuses, {
			field: 'dateMax',
			operator: '>=',
		});
	}

	public watchPastSingles(
		space: ISpaceContext,
		statuses: HappeningStatus[] = ['active'],
	): Observable<IHappeningContext[]> {
		return this.watchSingles(
			space,
			statuses,
			{
				field: 'dateMax',
				operator: '<',
			},
			undefined,
			100,
		);
	}

	public watchRecentlyCreatedSingles(
		space: ISpaceContext,
		statuses: HappeningStatus[] = ['active'],
	): Observable<IHappeningContext[]> {
		return this.watchSingles(
			space,
			statuses,
			undefined,
			orderBy('createdAt', 'desc'),
			10,
		);
	}

	private watchSingles(
		space: ISpaceContext,
		statuses: HappeningStatus[],
		dateCondition?:
			| {
					field: 'dateMax';
					operator: '>=';
			  } // Upcoming
			| {
					field: 'dateMax';
					operator: '<';
			  }, // Past
		orderByConstraint?: QueryOrderByConstraint,
		limit?: number,
	): Observable<IHappeningContext[]> {
		const date = dateToIso(new Date());
		console.log('watchSingles()', space.id, date, dateCondition);
		const typeCondition: IFilter = {
			field: 'type',
			operator: '==',
			value: 'single',
		};
		const filter = [typeCondition, HappeningService.statusFilter(statuses)];
		if (dateCondition) {
			filter.push({ ...dateCondition, value: date });
		}
		return this.spaceItemService
			.watchModuleSpaceItemsWithSpaceRef(space, {
				filter,
				orderBy: orderByConstraint ? [orderByConstraint] : undefined,
				limit,
			})
			.pipe(
				tap((happening) => console.log('watchSingles() =>', happening)),
				map((happenings) => {
					return happenings.map((h) => processHappeningContext(h, space));
				}),
			);
	}

	public watchSinglesOnSpecificDay(
		space: ISpaceContext,
		date: string,
		status: HappeningStatus = 'active',
	): Observable<IHappeningContext[]> {
		if (!space.id) {
			return throwError(() => 'missing required field "spaceID"');
		}
		if (!date) {
			return throwError(() => 'missing required field "date"');
		}
		console.log('watchSinglesOnSpecificDay()', space.id, date, status);
		// const teamDate = team.id + ':' + date;
		return this.spaceItemService
			.watchModuleSpaceItemsWithSpaceRef(space, {
				filter: [
					HappeningService.statusFilter([status]),
					{ field: 'dates', operator: 'array-contains', value: date },
				],
			})
			.pipe(
				tap((happenings) => {
					console.log(
						'watchSinglesOnSpecificDay() =>',
						space.id,
						date,
						status,
						happenings,
					);
				}),
				map((happenings) =>
					happenings.map((h) => processHappeningContext(h, space)),
				),
			);
	}
}

@NgModule({
	providers: [HappeningService],
})
export class HappeningServiceModule {}
