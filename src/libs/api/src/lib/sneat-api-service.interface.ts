import {Observable} from 'rxjs';
import {HttpParams} from "@angular/common/http";
import {InjectionToken} from "@angular/core";
import {IHttpRequestOptions} from '@sneat/datatug/services/repo';

const SneatApiService = new InjectionToken('ISneatApiService');

export interface ISneatApiResponse<T> { // TODO: Either use or delete
	data: T;
}

export interface ISneatApiService {
	post<I, O>(endpoint: string, body: I, options?: IHttpRequestOptions): Observable<O>;

	put<I, O>(endpoint: string, body: I, options?: IHttpRequestOptions): Observable<O>;

	get<T>(endpoint: string, params?: HttpParams, options?: IHttpRequestOptions): Observable<T>

	getAsAnonymous<T>(endpoint: string, params?: HttpParams, options?: IHttpRequestOptions): Observable<T>;
}

