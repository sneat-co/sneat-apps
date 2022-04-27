import { Injectable, NgModule } from '@angular/core';
import { SneatFirestoreService } from '@sneat/api';
import { happeningBriefFromDto, IAssetBrief, IAssetDto, IHappeningBrief, IHappeningDto } from '@sneat/dto';
import { IHappeningContext, IRecurringContext, ITeamContext } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';

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
}

@NgModule({
	providers: [
		HappeningService,
	],
})
export class RecurringHappeningServiceModule {
}
