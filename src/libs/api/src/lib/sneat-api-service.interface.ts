import {Observable} from 'rxjs';
import {HttpParams} from "@angular/common/http";
import {InjectionToken} from "@angular/core";

const SneatApiService = new InjectionToken('ISneatApiService');

export interface ISneatApiResponse<T> { // TODO: Either use or delete
	data: T;
}

export interface ISneatApiService {
	post<I, O>(endpoint: string, body: I): Observable<O>;

	get<T>(endpoint: string, params?: HttpParams): Observable<T>

	getAsAnonymous<T>(endpoint: string, params?: HttpParams): Observable<T>;
}

