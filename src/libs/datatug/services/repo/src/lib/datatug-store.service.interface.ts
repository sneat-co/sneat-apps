import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {DatatugStoreFirestoreService} from './datatug-store.service.firestore';

export interface IDatatugStoreService {
	watchProjectItem<T>(projectId: string, path: string): Observable<T | null>;
}

@Injectable({providedIn: 'root'})
export class DatatugStoreServiceFactory {

	constructor(
		private readonly firestoreService: DatatugStoreFirestoreService,
	) {
	}

	getDatatugStoreService(store: string): IDatatugStoreService {
		switch (store) {
			case 'firestore':
				return this.firestoreService;
			default:
				throw new Error('unknown store: ' + store)
		}
	}
}
