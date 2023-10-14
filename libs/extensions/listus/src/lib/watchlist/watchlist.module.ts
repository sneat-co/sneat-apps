import { NgModule } from '@angular/core';
import { IMovieService, ITmdbService } from './interfaces';
import { TmdbService } from './tmdb.service';
import { MovieService } from './movie.service';

@NgModule({
	providers: [
		{ provide: ITmdbService, useClass: TmdbService },
		{ provide: IMovieService, useClass: MovieService },
	],
})
export class WatchlistModule {}
