import { Injectable } from '@angular/core';
import { DatatugStoreGithubService } from './datatug-store.service.github';
import { DatatugStoreFirestoreService } from './datatug-store.service.firestore';
import { IDatatugStoreService } from './datatug-store.service.interface';

@Injectable({ providedIn: 'root' })
export class DatatugStoreServiceFactory {
	// TODO: consider to use separate factory per each service

	constructor(
		private readonly firestoreService: DatatugStoreFirestoreService,
		private readonly githubService: DatatugStoreGithubService,
	) {
	}

	getDatatugStoreService(store: string): IDatatugStoreService {
		switch (store) {
			case 'firestore':
				return this.firestoreService;
			case 'github.com':
			case 'github':
				return this.githubService;
			default:
				throw new Error('unknown store: ' + store);
		}
	}
}
