import {ICommuneRecord} from './dto-models';
import {IMovie} from '../movie-models';

export interface IMovieDto extends ICommuneRecord, IMovie {
	listIds: string[];
}


