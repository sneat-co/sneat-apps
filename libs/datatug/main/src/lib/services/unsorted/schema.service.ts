import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { SneatApiService } from '@sneat/api';
import { IRecord } from '@sneat/data';
import { CreateNamedRequest } from '../../dto/requests';
import { ISchema } from '../../models/definition/schema';
import { createProjItem } from '../base/create-object';

@Injectable()
export class SchemaService {
	private readonly api = inject(SneatApiService);

	public createSchema = (
		request: CreateNamedRequest,
	): Observable<IRecord<ISchema>> => {
		try {
			return createProjItem<ISchema>(
				this.api,
				'datatug/schema/create_schema',
				request,
			);
		} catch (err) {
			return throwError(err);
		}
	};
}
