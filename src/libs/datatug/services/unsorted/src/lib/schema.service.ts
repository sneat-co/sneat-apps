import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {createObject, SneatTeamApiService} from '@sneat/api';
import {CreateNamedRequest} from '@sneat/datatug/dto';
import {ISchema} from '@sneat/datatug/models';
import {IRecord} from '@sneat/data';

// import {ProjectService} from './project.service';

@Injectable()
export class SchemaService {

  constructor(
    private readonly api: SneatTeamApiService,
  ) {
  }

  public createSchema = (request: CreateNamedRequest): Observable<IRecord<ISchema>> => {
    console.log('createSchema', request);
    try {
      return createObject<ISchema>(this.api, 'datatug/schema/create_schema', request);
    } catch (err) {
      return throwError(err);
    }
  }
}
