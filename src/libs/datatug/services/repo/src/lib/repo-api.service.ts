import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getRepoUrl} from '@sneat/datatug/nav';

@Injectable()
export class RepoApiService {

	constructor(
		private readonly httpClient: HttpClient,
	) {
	}

	private static getUrl(repo: string, path: string): string {
		const repoUrl = getRepoUrl(repo);
		return `${repoUrl}${path}`;
	}

	public get<T>(repoId: string, path: string, options?: IHttpRequestOptions): Observable<T> {
		const url = RepoApiService.getUrl(repoId, path);
		// console.log('url', url);
		return this.httpClient.get<T>(url, options);
	}

	// noinspection JSUnusedGlobalSymbols
	public post<T>(repoId: string, path: string, body: any, options?: IHttpRequestOptions): Observable<T> {
		const url = RepoApiService.getUrl(repoId, path);
		return this.httpClient.post<T>(url, body, options);
	}

	// noinspection JSUnusedGlobalSymbols
	public put<T>(repoId: string, path: string, body: any, options?: IHttpRequestOptions): Observable<T> {
		const url = RepoApiService.getUrl(repoId, path);
		return this.httpClient.put<T>(url, body, options);
	}

	// noinspection JSUnusedGlobalSymbols
	public delete<T>(repoId: string, path: string, options?: IHttpRequestOptions) {
		const url = RepoApiService.getUrl(repoId, path);
		return this.httpClient.delete<T>(url, options);
	}
}

export interface IHttpRequestOptions {
	headers?: HttpHeaders | {
		[header: string]: string | string[];
	};
	observe?: 'body';
	params?: HttpParams | {
		[param: string]: string | string[];
	};
	reportProgress?: boolean;
	responseType?: 'json';
	withCredentials?: boolean;
}
