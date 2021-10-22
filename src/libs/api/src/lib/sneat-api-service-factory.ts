import { Injectable } from '@angular/core';
import { ISneatApiService } from './sneat-api-service.interface';
import { SneatApiService } from './sneat-team-api.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { parseStoreRef, storeRefToId } from '@sneat/core';
import { getStoreUrl } from '@sneat/datatug/nav';

@Injectable({ providedIn: 'root' })
export class SneatApiServiceFactory {
	private firebaseIdToken?: string | null;

	private services: { [id: string]: ISneatApiService } = {};

	constructor(
		private readonly httpClient: HttpClient,
		readonly afAuth: AngularFireAuth
	) {
		console.log('SneatApiServiceFactory.constructor()');
		afAuth.idToken.subscribe((idToken) => {
			this.firebaseIdToken = idToken;
			this.services = {};
		});
	}

	getSneatApiService(storeId: string): ISneatApiService {
		if (!storeId) {
			throw new Error(
				'storeRef is a required parameter, got empty: ' + typeof storeId
			);
		}
		const storeRef = parseStoreRef(storeId);
		if (!storeRef.type) {
			throw new Error(
				'storeRef.type is a required parameter, got empty: ' +
					typeof storeRef.type
			);
		}
		const id = `${storeRef.type}:${storeRef.url}`;
		let service = this.services[id];
		if (service) {
			return service;
		}
		const baseUrl = getStoreUrl(storeRefToId(storeRef));
		switch (storeRef.type) {
			case 'firestore':
				this.services[id] = service = new SneatApiService(
					this.httpClient,
					this.firebaseIdToken || undefined,
					baseUrl
				);
				return service;
			default:
				throw new Error('unknown store type: ' + storeRef.type);
		}
	}
}
