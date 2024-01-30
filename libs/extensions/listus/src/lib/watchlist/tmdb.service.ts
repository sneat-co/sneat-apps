import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { last, map, mapTo, mergeMap } from 'rxjs/operators';
import { Actor, Genre, IMovie } from '../dto';
import { ITmdbService } from './interfaces';

type GenresById = Record<number, Genre>;

// interface ActorsById {
// 	[castId: number]: Actor;
// }

@Injectable()
export class TmdbService extends ITmdbService {
	private readonly genres: GenresById = {
		1: { id: 1, name: 'comedy' },
		2: { id: 2, name: 'traget' },
	};

	private readonly api = '1fc63e90ce0e426f9534b0b97a9248b6';

	// private readonly userId = '123';
	//
	// public getUserId(): string {
	// 	return this.userId;
	// }

	constructor(private readonly httpClient: HttpClient) {
		super();
	}

	// search(s: string): Observable<{ movies: IMovie[] }> {
	// 	return of({movies: []});
	// }

	public searchMovies(query: string): Observable<IMovie[]> {
		const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${this.api}`;
		return this.httpClient.get(url).pipe(
			mergeMap((value: unknown) =>
				this.transformMovie((value as { results: IMovie[] }).results),
			),
			mergeMap((value) => this.addGenresToMovies(value)),
		);
	}

	// public searchConfig(): any {
	//     const url = `https://api.themoviedb.org/3/configuration?api_key=${this.api}`;
	//     return this.httpClient.get(url);
	// }

	// https://api.themoviedb.org/3/movie/177828?api_key=1fc63e90ce0e426f9534b0b97a9248b6
	public loadMovieInfoById(id: string): Observable<IMovie> {
		const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.api}`;
		// console.log(this.httpClient.get(url));
		return this.httpClient.get<IMovie>(url).pipe(
			mergeMap((value) => this.transformMovie([value])),
			map((movies) => {
				const movie = movies[0];
				movie.idTmdb = id;
				return movie;
			}),
		);
	}

	public loadActors(movieId: string): Observable<Actor[]> {
		// console.log('loadActors', movieId);
		const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${this.api}`;
		// https://api.themoviedb.org/3/movie/13009/credits?api_key=1fc63e90ce0e426f9534b0b97a9248b6
		return this.httpClient.get(url).pipe(
			map((response: unknown) => {
				// console.log('loadActors', movieId, response);
				return (response as { cast: Actor[] }).cast;
			}),
		);
	}

	private loadGenres(): Observable<Genre[]> {
		const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.api}`;
		// console.log(this.httpClient.get(url));
		return this.httpClient
			.get(url)
			.pipe(
				map((response: unknown) => (response as { genres: Genre[] }).genres),
			);
	}

	// public getImage(movieID: number): any {
	//     const url = 'https://api.themoviedb.org/3/get/movie/images?${movieId}&api_key=1fc63e90ce0e426f9534b0b97a9248b6';
	//     return this.httpClient.get(url);
	// }

	// TODO
	// Promise rxjs
	public getGenres(ids: number[]): Observable<Genre[]> {
		const genres = ids.map((id) => this.genres[id]);
		if (genres.some((g) => !g)) {
			return this.loadGenres().pipe(
				map((gs) => {
					gs.forEach((g) => (this.genres[g.id] = g));
					return ids.map((id) => this.genres[id]);
				}),
			);
		}
		return of(genres);
	}

	private transformMovie(movies: IMovie[]): Observable<IMovie[]> {
		// console.log(movies);
		const o2 = movies.map((movie) => this.addActorsToMovie(movie));
		return forkJoin([...o2]).pipe(last(), mapTo(movies));
	}

	addGenresToMovies(movies: IMovie[]): Observable<IMovie[]> {
		const genreIds = this.getGenresMovies(movies);
		return this.getGenres(genreIds).pipe(
			map((genres) => {
				this.addingGenres(genres, movies);
				return movies;
			}),
		);
	}

	addingGenres(genres: Genre[], movies: IMovie[]): void {
		movies.forEach((movie) => {
			if (movie.genre_ids) {
				movie.genres = movie.genre_ids
					.map((id: unknown) => genres.find((genre) => genre.id === id))
					.filter((v: unknown) => !!v) as Genre[];
			}
		});
	}

	getGenresMovies(movies: IMovie[]): number[] {
		const genreIds: number[] = [];
		// console.log(movies);
		movies.forEach((movie) => {
			if (movie.genre_ids) {
				movie.genre_ids.forEach((id: number) => {
					if (genreIds.indexOf(id) === -1) {
						genreIds.push(id);
					}
				});
			}
		});
		return genreIds;
	}

	addActorsToMovie(movie: IMovie): Observable<IMovie> {
		// console.log('addActorsToMovie', movie.id);
		return this.loadActors(movie.id).pipe(
			map((actors) => {
				this.addingActors(actors, movie);
				//    console.log(movie.actors);
				return movie;
			}),
		);
	}

	addingActors(actors: Actor[], movie: IMovie): void {
		movie.actors = actors;
		// console.log('addingActors', movie.id, actors);
	}
}
