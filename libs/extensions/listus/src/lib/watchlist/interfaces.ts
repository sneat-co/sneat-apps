import { IMovie, IMovieDbo } from '../dto';
import { Observable } from 'rxjs';

export abstract class IMovieService {
	abstract addCommuneItem(dto: IMovieDbo): Observable<IMovieDbo>;
}

export abstract class ITmdbService {
	abstract loadMovieInfoById(id: string): Observable<IMovie>;
}
