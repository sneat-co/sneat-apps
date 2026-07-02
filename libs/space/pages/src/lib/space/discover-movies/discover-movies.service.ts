import { Injectable, inject } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { MovieSummary } from '@sneat/extension-listus-contract';
import { Observable } from 'rxjs';

export interface IIdentifyMoviesRequest {
  readonly description: string;
}

export interface IIdentifyMoviesResponse {
  readonly movies?: MovieSummary[];
}

// Thin client for `POST /v0/listus/movies/identify` (listus backend, movius
// AI identify). The published @sneat/extension-listus-contract IListusService
// predates this endpoint and does not expose an identifyMovies() method yet —
// once the contract publishes one, replace this service with
// LISTUS_SERVICE.identifyMovies() (same wire shape, see
// listus/backend/dto4listus/dto_movie.go).
@Injectable()
export class DiscoverMoviesService {
  private readonly sneatApiService = inject(SneatApiService);

  // Read-only proxy over AI + TMDB — no spaceID needed (mirrors how the
  // listus internal ListService calls listus/movies/search & /resolve).
  public identifyMovies(
    request: IIdentifyMoviesRequest,
  ): Observable<IIdentifyMoviesResponse> {
    return this.sneatApiService.post('listus/movies/identify', request);
  }
}
