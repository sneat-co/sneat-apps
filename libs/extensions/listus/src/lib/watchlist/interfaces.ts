import { IMovie } from '../dto';
import { Observable } from 'rxjs';

export abstract class ITmdbService {
	abstract loadMovieInfoById(id: string): Observable<IMovie>;
}
