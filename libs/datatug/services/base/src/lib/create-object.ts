import { CreateNamedRequest } from '@sneat/ext-datatug-dto';
import { Observable, throwError } from 'rxjs';
import { IRecord } from '@sneat/data';
import { IProjItemBrief } from '@sneat/ext-datatug-models';

interface PostService {
	post<T>(endpoint: string, payload: unknown): Observable<T>;
}

const validateCreateNamedRequest = (
	request: CreateNamedRequest,
): Observable<never> | undefined => {
	if (!request.projectRef) {
		return throwError(() => 'projectRef is a required parameter');
	}
	if (!request.name) {
		return throwError(() => 'name is a required parameter');
	}
	return undefined;
};

export function createProjItem<
	T extends IProjItemBrief,
	R extends CreateNamedRequest = CreateNamedRequest,
>(api: PostService, endpoint: string, payload: R): Observable<IRecord<T>> {
	console.log('createObject', endpoint, payload);
	return validateCreateNamedRequest(payload) || api.post(endpoint, payload);
}
