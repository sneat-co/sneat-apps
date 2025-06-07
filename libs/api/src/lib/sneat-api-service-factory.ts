import { Injectable, inject } from '@angular/core';
import { ISneatApiService } from './sneat-api-service.interface';
import { parseStoreRef } from '@sneat/core';
import { SneatApiService } from './sneat-api-service';

export const getStoreUrl = (storeId: string): string => {
	if (storeId === 'firestore') {
		const v = 'http://localhost:4300/v0'; //environment.agents.firestoreStoreAgent;
		console.log('firestoreStoreAgent', v);
		return v.endsWith('/') ? v.substring(0, v.length - 1) : v;
	}
	if (!storeId || storeId.match(/https?:\/\//)) {
		return storeId;
	}
	if (storeId.startsWith('http-')) {
		return storeId.replace('http-', 'http' + '://');
	}
	if (storeId.startsWith('https-')) {
		return storeId.replace('https-', 'https://');
	}
	const a = storeId.split(':');
	storeId = `//${a[0]}:${a[1]}`;
	if (a[2]) {
		storeId += ':' + a[2];
	}
	return storeId;
};

@Injectable({ providedIn: 'root' })
export class SneatApiServiceFactory {
	private services: Record<string, ISneatApiService> = {};

	constructor() {
		console.log('SneatApiServiceFactory.constructor()');
	}

	public getSneatApiService(storeId: string): ISneatApiService {
		if (!storeId) {
			throw new Error(
				'storeRef is a required parameter, got empty: ' + typeof storeId,
			);
		}
		const storeRef = parseStoreRef(storeId);
		if (!storeRef.type) {
			throw new Error(
				'storeRef.type is a required parameter, got empty: ' +
					typeof storeRef.type,
			);
		}
		const id = `${storeRef.type}:${storeRef.url}`;
		let service = this.services[id];
		if (service) {
			return service;
		}
		// const baseUrl = getStoreUrl(storeRefToId(storeRef));
		switch (storeRef.type) {
			case 'firestore':
				inject(SneatApiService);
				this.services[id] = service = new SneatApiService(/*baseUrl*/);
				return service;
			default:
				throw new Error('unknown store type: ' + storeRef.type);
		}
	}
}
