import {Observable, throwError} from 'rxjs';
import {IDbServer} from '@sneat/datatug/models';

export interface CreateNamedRequest {
	project: string;
	name: string;
}

const validateCreateNamedRequest = (request: CreateNamedRequest): Observable<never> => {
	if (!request.project) {
		return throwError('project is a required parameter');
	}
	if (!request.name) {
		return throwError('name is a required parameter');
	}
	return undefined;
};


// TODO: It's probably not right place for this function
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
// export function createObject<T>(api: SneatTeamApiService, endpoint: string, payload: CreateNamedRequest): Observable<IRecord<T>> {
// 	console.log('createObject', endpoint, payload);
// 	const err = validateCreateNamedRequest(payload)
// 	if (err) {
// 		console.error('Invalid payload');
// 		return err;
// 	}
// 	return api.post(endpoint, payload);
// }


export interface GetServerDatabasesRequest {
	project?: string;
	dbServer: IDbServer;
}
