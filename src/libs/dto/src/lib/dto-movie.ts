import { ITeamRecord } from './dto-models';
import { IListItemInfo } from './dto-list';

export interface IMovie extends IListItemInfo {
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
	watchedByUserIds?: string[];
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

export interface IMovieDto extends ITeamRecord, IMovie {
	listIds: string[];
}


