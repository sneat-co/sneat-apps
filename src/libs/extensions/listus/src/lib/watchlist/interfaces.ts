import {ICommuneItemService} from '../../../services/interfaces';
import {MovieKind} from '../../../models/kinds';
import {IMovieDto} from '../../../models/dto/dto-movie';
import {ListusAppSchema} from '../../../models/db-schemas-by-app';
import {Observable} from 'rxjs';
import {IMovie} from '../../../models/movie-models';

export abstract class IMovieService extends ICommuneItemService<IMovieDto, ListusAppSchema, typeof MovieKind> {
	// abstract getById(id: string, tx?: IRxReadonlyTransaction<ListusAppSchema>): Observable<IMovieDto | undefined>;
}

export abstract class ITmdbService {
	abstract loadMovieInfoById(id: string): Observable<IMovie>;
}
