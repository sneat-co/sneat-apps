import { Inject, Injectable, NgModule } from '@angular/core';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { dateToIso } from '@sneat/core';
import { happeningBriefFromDto, IAssetBrief, IAssetDto, IHappeningBrief, IHappeningDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext, IRecurringContext, ITeamContext, ITeamRequest } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { map, Observable, throwError } from 'rxjs';
import { ICreateHappeningRequest } from './schedule.service';

export interface IHappeningRequest extends ITeamRequest {
	happeningID: string
	happeningType?: string;
}

export interface IHappeningMemberRequest extends ITeamRequest {
	happeningID: string
	memberID: string;
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
		}
		return this.sneatApiService.delete('happenings/delete_happening', undefined, request);
	}

	removeMember(happening: IHappeningContext, memberID: string): Observable<void> {
		const request: IHappeningMemberRequest = {
			teamID: happening.team?.id || '',
			happeningID: happening.id,
			memberID,
		}
		return this.sneatApiService.post('happenings/remove_member', request);
	}

	addMember(happening: IHappeningContext, memberID: string): Observable<void> {
		const request: IHappeningMemberRequest = {
			teamID: happening.team?.id || '',
			happeningID: happening.id,
			memberID,
		}
		return this.sneatApiService.post('happenings/add_member', request);
	}

	// watchByTeam(team: ITeamContext): Observable<IHappeningContext[]> {
	// 	return this.sfs.watchByTeamID(team.id);
	// }

	watchHappeningByID(id: string): Observable<IHappeningContext> {
		return this.sfs.watchByID(id);
	}

	watchUpcomingSingles(teamID: string, status: 'active' | 'archived' = 'active'): Observable<IHappeningContext[]> {
		const date = dateToIso(new Date());
		return this.sfs.watchByFilter([
			{ field: 'teamIDs', operator: 'array-contains', value: teamID },
			{ field: 'status', operator: '==', value: status },
			{ field: 'date', operator: '>=', value: date},
		]).pipe(map(happenings => {
			return happenings.map(h => {
				const happening: IHappeningContext = {...h, team: {id: teamID}};
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
