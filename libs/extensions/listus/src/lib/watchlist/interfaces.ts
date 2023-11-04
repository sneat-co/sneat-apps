import { IMovie } from '../dto';
import { Observable } from 'rxjs';

export abstract class IMovieService /*extends ICommuneItemService<IMovieDto, ListusAppSchema, typeof MovieKind>*/ {
	// abstract getById(id: string, tx?: IRxReadonlyTransaction<ListusAppSchema>): Observable<IMovieDto | undefined>;
}

export abstract class ITmdbService {
	abstract loadMovieInfoById(id: string): Observable<IMovie>;
}
