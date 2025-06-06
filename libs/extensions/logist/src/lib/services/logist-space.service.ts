import { Injectable, NgModule, Injector, inject } from '@angular/core';
import {
	Firestore as AngularFirestore,
	CollectionReference,
	DocumentReference,
	collection,
	doc,
} from '@angular/fire/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { Observable } from 'rxjs';
import {
	ILogistSpaceBrief,
	ILogistSpaceContext,
	ILogistSpaceDbo,
	ISetLogistSpaceSettingsRequest,
} from '../dto/logist-team-dto';

function briefFromDto(id: string, dto: ILogistSpaceDbo): ILogistSpaceBrief {
	return dto;
}

@Injectable()
export class LogistSpaceService {
	private readonly sneatApiService = inject(SneatApiService);
	private readonly afs = inject(AngularFirestore);

	private readonly sfs: SneatFirestoreService<
		ILogistSpaceBrief,
		ILogistSpaceDbo
	>;

	constructor() {
		const injector = inject(Injector);

		this.sfs = new SneatFirestoreService<ILogistSpaceBrief, ILogistSpaceDbo>(
			injector,
			briefFromDto,
		);
	}

	public watchLogistSpaceByID(
		spaceID: string,
	): Observable<ILogistSpaceContext> {
		return this.sfs.watchByDocRef(logistSpaceDocRef(this.afs, spaceID));
	}

	setLogistSpaceSettings(
		request: ISetLogistSpaceSettingsRequest,
	): Observable<void> {
		return this.sneatApiService.post(
			'logistus/set_logist_team_settings?ts=' + new Date().toISOString(),
			request,
		);
	}
}

function logistSpaceDocRef(
	afs: AngularFirestore,
	spaceID: string,
): DocumentReference<ILogistSpaceDbo> {
	const spacesCollection = collection(afs, 'spaces');
	const spaceRef = doc(spacesCollection, spaceID);
	const modulesCollection = collection(spaceRef, 'ext');
	return doc(
		modulesCollection as CollectionReference<ILogistSpaceDbo>,
		'logistus',
	);
}

export function logistSpaceModuleSubCollection<Dbo>(
	afs: AngularFirestore,
	spaceID: string,
	collectionName: string,
): CollectionReference<Dbo> {
	const moduleRef = logistSpaceDocRef(afs, spaceID);
	return collection(moduleRef, collectionName) as CollectionReference<Dbo>;
}

@NgModule({
	imports: [],
	providers: [LogistSpaceService],
})
export class LogistSpaceServiceModule {}
