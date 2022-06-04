import { Injectable, NgModule } from '@angular/core';
import { SneatFirestoreService } from '@sneat/api';
import { IDocumentBrief, IDocumentDto, TeamCounter } from '@sneat/dto';
import { IDocumentContext, ITeamRequest } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';

export interface ICreateDocumentRequest extends ITeamRequest {
	memberID?: string;
	assetID?: string;
	dto: IDocumentDto;
}

function documentBriefFromDto(id: string, dto: IDocumentDto): IDocumentBrief {
	return {
		id,
		...dto,
	};
}

@Injectable()
export class DocumentService {
	private readonly sfs: SneatFirestoreService<IDocumentBrief, IDocumentDto>;

	constructor(
		private readonly teamItemService: TeamItemBaseService,
	) {
		this.sfs = new SneatFirestoreService<IDocumentBrief, IDocumentDto>(
			'team_members', teamItemService.afs, documentBriefFromDto);
	}

	createDocument(request: ICreateDocumentRequest): Observable<IDocumentContext> {
		const response$ = this.teamItemService.createTeamItem<IDocumentBrief, IDocumentDto>(
			'documents/create_document', TeamCounter.documents, request);
		return response$;
	}

	watchDocumentsByTeamID(teamID: string): Observable<IDocumentContext[]> {
		console.log('watchDocumentsByTeamID()', teamID);
		return this.sfs.watchByTeamID(teamID);
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

@NgModule({
	imports: [],
	providers: [
		DocumentService,
	],
})
export class DocumentServiceModule {
}
