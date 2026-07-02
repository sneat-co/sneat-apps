import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';

import {
  DiscoverMoviesService,
  IIdentifyMoviesResponse,
} from './discover-movies.service';

describe('DiscoverMoviesService', () => {
  const response: IIdentifyMoviesResponse = {
    movies: [{ tmdbID: 27205, title: 'Inception', year: 2010 }],
  };
  let post: ReturnType<typeof vi.fn>;
  let service: DiscoverMoviesService;

  beforeEach(() => {
    post = vi.fn(() => of(response));
    TestBed.configureTestingModule({
      providers: [
        DiscoverMoviesService,
        { provide: SneatApiService, useValue: { post } },
      ],
    });
    service = TestBed.inject(DiscoverMoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('posts the description to listus/movies/identify', () => {
    let result: IIdentifyMoviesResponse | undefined;
    service
      .identifyMovies({ description: 'that movie about a chef' })
      .subscribe((r) => (result = r));
    expect(post).toHaveBeenCalledWith('listus/movies/identify', {
      description: 'that movie about a chef',
    });
    expect(result).toEqual(response);
  });
});
