import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
	getStoreUrl,
	IHttpRequestOptions,
	SneatApiServiceFactory,
} from '@sneat/api';

@Injectable()
export class StoreApiService {
	private readonly sneatApiServiceFactory = inject(SneatApiServiceFactory);
	private readonly httpClient = inject(HttpClient);

	private static getUrl(repo: string, path: string): string {
		const repoUrl = getStoreUrl(repo);
		return `${repoUrl}${path}`;
	}

	public get<T>(
		storeId: string,
		path: string,
		options?: IHttpRequestOptions,
	): Observable<T> {
		const url = StoreApiService.getUrl(storeId, path);
		// console.log('url', url);
		return this.httpClient.get<T>(url, options);
	}

	// noinspection JSUnusedGlobalSymbols
	public post<T>(
		storeId: string,
		path: string,
		body: unknown,
		options?: IHttpRequestOptions,
	): Observable<T> {
		const url = StoreApiService.getUrl(storeId, path);
		return this.httpClient.post<T>(url, body, options);
	}

	// noinspection JSUnusedGlobalSymbols
	public put<I, O>(
		storeId: string,
		path: string,
		body: I,
		options?: IHttpRequestOptions,
	): Observable<O> {
		const sneatApiService =
			this.sneatApiServiceFactory.getSneatApiService(storeId);
		const url = StoreApiService.getUrl(storeId, path);
		return sneatApiService.put<I, O>(url, body, options);
	}

	// noinspection JSUnusedGlobalSymbols
	public delete<T>(
		storeId: string,
		path: string,
		options?: IHttpRequestOptions,
	) {
		const url = StoreApiService.getUrl(storeId, path);
		return this.httpClient.delete<T>(url, options);
	}
}
