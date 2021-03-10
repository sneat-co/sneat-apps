import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {SneatTeamApiService} from '@sneat/api';
import {CreateNamedRequest} from '@sneat/datatug/dto';
import {ISchema} from '@sneat/datatug/models';
import {IRecord} from '@sneat/data';
import {createProjItem} from "@sneat/datatug/services/base";

@Injectable()
export class SchemaService {

	constructor(
		private readonly api: SneatTeamApiService,
	) {
	}

	public createSchema = (request: CreateNamedRequest): Observable<IRecord<ISchema>> => {
		try {
			return createProjItem<ISchema>(this.api, 'datatug/schema/create_schema', request);
		} catch (err) {
			return throwError(err);
		}
	}
}
