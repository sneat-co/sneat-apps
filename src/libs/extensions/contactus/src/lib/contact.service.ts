import { Injectable, NgModule } from '@angular/core';
import { IContactBrief, IContactDto, TeamCounter } from '@sneat/dto';
import { IContactContext, ITeamContext, ITeamRequest } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';

export interface ICreateContactRequest extends ITeamRequest {
	title: string;
}

@Injectable()
export class ContactService {
	constructor(
		private readonly teamItemService: TeamItemBaseService,
	) {
	}

	createContact(request: ICreateContactRequest): Observable<IContactContext> {
		return this.teamItemService.createTeamItem<IContactBrief, IContactDto>(
			'contacts/create_contact', TeamCounter.contacts, request);
	}

	deleteContact(contact: IContactContext): Observable<void> {
		return throwError(() => 'not implemented yet');
	}

	watchByTeam(team: ITeamContext): Observable<IContactContext[]> {
		return this.teamItemService.watchTeamItems<IContactBrief, IContactDto>(team, 'team_contacts');
	}
}

@NgModule({
	providers: [
		ContactService,
	],
})
export class ContactServiceModule {

}
