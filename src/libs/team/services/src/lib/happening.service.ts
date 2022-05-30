import { Inject, Injectable, NgModule } from '@angular/core';
import { IFilter, SneatApiService, SneatFirestoreService } from '@sneat/api';
import { dateToIso } from '@sneat/core';
import {
	happeningBriefFromDto, HappeningStatus,
	IHappeningBrief,
	IHappeningDto,
	IHappeningSlot,
} from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext, ITeamRequest } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { map, Observable, throwError } from 'rxjs';

export interface ICreateHappeningRequest {
	teamID: string;
	dto: IHappeningDto;
}

export interface IHappeningRequest extends ITeamRequest {
	happeningID: string;
	happeningType?: string;
}

export interface IHappeningMemberRequest extends ITeamRequest {
	happeningID: string;
	memberID: string;
}

export interface IHappeningSlotRequest extends IHappeningRequest {
	slot: IHappeningSlot;
}

@Injectable()
export class HappeningService {
	private readonly sfs: SneatFirestoreService<IHappeningBrief, IHappeningDto>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamItemBaseService: TeamItemBaseService,
		private readonly sneatApiService: SneatApiService,
	) {
		this.sfs = new SneatFirestoreService<IHappeningBrief, IHappeningDto>(
			'happenings', teamItemBaseService.afs, happeningBriefFromDto,
		);
	}

	createHappening(request: ICreateHappeningRequest): Observable<any> {
		if (!request) {
			return throwError(() => new Error('missing required parameter: request'));
		}
		return this.sneatApiService.post('happenings/create_happening', request);
	}

	deleteHappening(happening: IHappeningContext): Observable<void> {
		console.log('deleteHappening', happening);
		const request: IHappeningRequest = {
			teamID: happening.team?.id || '',
			happeningID: happening.id,
			happeningType: happening.brief?.type || happening.dto?.type,
		};
		return this.sneatApiService.delete('happenings/delete_happening', undefined, request);
	}

	removeMember(teamID: string, happening: IHappeningContext, memberID: string): Observable<void> {
		const request: IHappeningMemberRequest = {
			teamID: teamID,
			happeningID: happening.id,
			memberID,
		};
		return this.sneatApiService.post('happenings/remove_member', request);
	}

	addMember(teamID: string, happening: IHappeningContext, memberID: string): Observable<void> {
		const request: IHappeningMemberRequest = {
			teamID,
			happeningID: happening.id,
			memberID,
		};
		return this.sneatApiService.post('happenings/add_member', request);
	}

	updateSlot(teamID: string, happeningID: string, slot: IHappeningSlot): Observable<void> {
		const request: IHappeningSlotRequest = {
			teamID,
			happeningID,
			slot,
		};
		return this.sneatApiService.post('happenings/update_slot', request);
	}

	// watchByTeam(team: ITeamContext): Observable<IHappeningContext[]> {
	// 	return this.sfs.watchByTeamID(team.id);
	// }

	watchHappeningByID(id: string): Observable<IHappeningContext> {
		return this.sfs.watchByID(id);
	}

	watchUpcomingSingles(teamID: string, statuses: HappeningStatus[] = ['active']): Observable<IHappeningContext[]> {
		const date = dateToIso(new Date());
		return this.sfs.watchByFilter([
			{ field: 'teamIDs', operator: 'array-contains', value: teamID },
			HappeningService.statusFilter(statuses),
			{ field: 'dateMin', operator: '>=', value: date },
		]).pipe(map(happenings => {
			return happenings.map(h => {
				const happening: IHappeningContext = { ...h, team: { id: teamID } };
				return happening;
			});
		}));
	}

	static statusFilter(statuses: HappeningStatus[]): IFilter {
		const operator = statuses?.length === 1 ? '==' : 'in';
		const value = statuses.length === 1 ? statuses[0] : statuses;
		return { field: 'status', operator, value };
	}

	watchSinglesOnSpecificDay(teamID: string, date: string, statuses: HappeningStatus[] = ['active']): Observable<IHappeningContext[]> {
		if (!teamID) {
			return throwError(() => 'missing required field "teamID"');
		}
		if (!date) {
			return throwError(() => 'missing required field "date"');
		}
		console.log('watchSinglesOnSpecificDay()', teamID, date, statuses);
		const teamDate = teamID + ':' + date;
		return this.sfs.watchByFilter([
			{ field: 'teamDates', operator: 'array-contains', value: teamDate },
			HappeningService.statusFilter(statuses),
		]).pipe(map(happenings => {
			return happenings.map(h => {
				const happening: IHappeningContext = { ...h, team: { id: teamID } };
				return happening;
			});
		}));
	}
}

@NgModule({
	providers: [
		HappeningService,
	],
})
export class HappeningServiceModule {
}
