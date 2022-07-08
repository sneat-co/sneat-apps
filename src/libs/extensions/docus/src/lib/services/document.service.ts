import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { IDocumentBrief, IDocumentDto, TeamCounter } from '@sneat/dto';
import { IDocumentContext, ITeamContext, ITeamRequest } from '@sneat/team/models';
import { TeamItemService } from '@sneat/team/services';
import { Observable, tap, throwError } from 'rxjs';

export interface ICreateDocumentRequest extends ITeamRequest {
	memberID?: string;
	assetID?: string;
	dto: IDocumentDto;
}


@Injectable()
export class DocumentService {
	private readonly teamItemService: TeamItemService<IDocumentBrief, IDocumentDto>;

	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.teamItemService = new TeamItemService<IDocumentBrief, IDocumentDto>(
			'documents', afs, sneatApiService);
	}

	createDocument(team: ITeamContext, request: ICreateDocumentRequest): Observable<IDocumentContext> {
		const response$ = this.teamItemService.createTeamItem<IDocumentBrief, IDocumentDto>(
			'documents/create_document', team, request);
		return response$;
	}

	watchDocumentsByTeam(team: ITeamContext): Observable<IDocumentContext[]> {
		console.log('watchDocumentsByTeamID()', team.id);
		return this.teamItemService.watchTeamItems(team);
	}

	deleteDocument(doc: IDocumentContext): Observable<void> {
		if (!doc.team) {
			return throwError(() => 'can not delete document without team context');
		}
		const request = {
			teamID: doc.team.id,
			docID: doc.id,
		};
		return this.teamItemService.deleteTeamItem<void>('documents/delete_document', request);
	}
}
