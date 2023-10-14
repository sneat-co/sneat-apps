import { IListItemBrief } from './dto-list';
import { IWithTeamIDs } from './dto-models';

export interface IMovie extends IListItemBrief {
	original_title?: string;
	original_language?: string;
	backdrop_path?: string;
	genre_ids?: number[];
	genres?: Genre[];
	adult?: boolean;
	overview?: string;
	popularity?: number;
	posterPath?: string;
	release_date?: string;
	video?: boolean;
	vote_average?: number;
	voteCount?: number;
	idTmdb?: string;
	actors?: Actor[];
	watchedByUserIDs?: string[];
}

export interface Genre {
	id: number;
	name: string;
}

export interface Actor {
	castId?: number;
	character?: string;
	credit_id?: string;
	gender?: number;
	id?: number;
	name?: string;
	order?: number;
	profile_path?: string;
}

export interface IMovieDto extends IWithTeamIDs, IMovie {
	listIds: string[];
}
