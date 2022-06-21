import { Injectable, NgModule } from '@angular/core';
import { IContactBrief, IContactDto, TeamCounter } from '@sneat/dto';
import { IContactContext, ICreateContactRequest, ITeamContext, ITeamRequest } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';
import { ContactNavService } from './contact-nav-service';

@Injectable()
export class ContactService {
	constructor(
		private readonly teamItemService: TeamItemBaseService,
	) {
	}

	createContact(request: ICreateContactRequest, endpoint = 'contacts/create_contact'): Observable<IContactContext> {
		return this.teamItemService.createTeamItem(endpoint, TeamCounter.contacts, request);
	}

	deleteContact(contact: IContactContext): Observable<void> {
		return throwError(() => 'not implemented yet');
	}

	watchByTeam(team: ITeamContext): Observable<IContactContext[]> {
		return this.teamItemService.watchTeamItems<IContactBrief, IContactDto>(team, 'team_contacts');
	}

	watchById(contactID: string): Observable<IContactContext> {
		return throwError(() => 'not implemented');
	}
}

@NgModule({
	imports: [

	],
	providers: [
		ContactService,
		ContactNavService,
	],
})
export class ContactServiceModule {

}
