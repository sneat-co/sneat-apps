import { Injectable, inject } from '@angular/core';
import { DatatugStoreGithubService } from './datatug-store.service.github';
import { DatatugStoreFirestoreService } from './datatug-store.service.firestore';
import { IDatatugStoreService } from './datatug-store.service.interface';

@Injectable()
export class DatatugStoreServiceFactory {
	private readonly firestoreService = inject(DatatugStoreFirestoreService);
	private readonly githubService = inject(DatatugStoreGithubService);

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
