import { Injectable, NgModule } from '@angular/core';
import { SneatFirestoreService } from '@sneat/api';
import { dateToIso } from '@sneat/core';
import { happeningBriefFromDto, IAssetBrief, IAssetDto, IHappeningBrief, IHappeningDto } from '@sneat/dto';
import { IHappeningContext, IRecurringContext, ITeamContext } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { map, Observable, throwError } from 'rxjs';

@Injectable()
export class HappeningService {
	private readonly sfs: SneatFirestoreService<IHappeningBrief, IHappeningDto>;

	constructor(
		private readonly teamItemBaseService: TeamItemBaseService,
	) {
		this.sfs = new SneatFirestoreService<IHappeningBrief, IHappeningDto>(
			'happenings', teamItemBaseService.afs, happeningBriefFromDto,
		);
	}

	deleteHappening(happening: IHappeningContext): Observable<void> {
		return throwError(() => 'not implemented yet');
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
