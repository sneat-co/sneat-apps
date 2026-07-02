import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import {
  APP_INFO,
  ErrorLogger,
  LOGGER_FACTORY,
  NgModulePreloaderService,
  TopMenuService,
} from '@sneat/core';
import { LISTUS_SERVICE, MovieSummary } from '@sneat/extension-listus-contract';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of, throwError } from 'rxjs';

import { DiscoverMoviesPageComponent } from './discover-movies-page.component';
import { DiscoverMoviesService } from './discover-movies.service';

describe('DiscoverMoviesPageComponent', () => {
  let component: DiscoverMoviesPageComponent;
  let fixture: ComponentFixture<DiscoverMoviesPageComponent>;

  const candidates: MovieSummary[] = [
    { tmdbID: 27205, title: 'Inception', year: 2010 },
    { tmdbID: 603, title: 'The Matrix', year: 1999 },
  ];

  let identifyMovies: ReturnType<typeof vi.fn>;
  let addMovieToWatchlist: ReturnType<typeof vi.fn>;
  let getListById: ReturnType<typeof vi.fn>;
  let resolveMovie: ReturnType<typeof vi.fn>;
  let toastCreate: ReturnType<typeof vi.fn>;
  let logError: ReturnType<typeof vi.fn>;

  beforeEach(waitForAsync(async () => {
    identifyMovies = vi.fn(() => of({ movies: candidates }));
    addMovieToWatchlist = vi.fn(() =>
      of({ item: { id: 'item1', title: 'Inception', tmdbID: 27205 } }),
    );
    getListById = vi.fn(() =>
      of({ id: 'movies', type: 'watch', dbo: { title: 'To Watch' } }),
    );
    resolveMovie = vi.fn(() =>
      of({
        movie: { tmdbID: 27205, title: 'Inception', overview: 'A thief…' },
      }),
    );
    toastCreate = vi.fn(() => Promise.resolve({ present: vi.fn() }));
    logError = vi.fn();

    await TestBed.configureTestingModule({
      imports: [DiscoverMoviesPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'DiscoverMoviesPageComponent' },
        { provide: DiscoverMoviesService, useValue: { identifyMovies } },
        {
          provide: LISTUS_SERVICE,
          useValue: { addMovieToWatchlist, getListById, resolveMovie },
        },
        { provide: ToastController, useValue: { create: toastCreate } },
        {
          provide: SneatUserService,
          useValue: {
            userState: of(null),
            userChanged: of(undefined),
            currentUserID: undefined,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map()),
            queryParamMap: of(new Map()),
            queryParams: of({}),
            params: of({}),
            snapshot: {
              paramMap: { get: () => null },
              queryParamMap: { get: () => null },
            },
          },
        },
        {
          provide: APP_INFO,
          useValue: { appId: 'test', appTitle: 'Test' },
        },
        {
          provide: LOGGER_FACTORY,
          useValue: { getLogger: () => console },
        },
        {
          provide: ErrorLogger,
          useValue: {
            logError,
            logErrorHandler: () => vi.fn(),
          },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
        {
          provide: NgModulePreloaderService,
          useValue: { preload: vi.fn(), markAsPreloaded: vi.fn() },
        },
        {
          provide: SpaceService,
          useValue: { watchSpace: vi.fn(() => of(null)) },
        },
        { provide: NavController, useValue: {} },
        { provide: TopMenuService, useValue: {} },
        {
          provide: SpaceComponentBaseParams,
          useValue: {
            errorLogger: {
              logError,
              logErrorHandler: () => vi.fn(),
            },
            loggerFactory: { getLogger: () => console },
            userService: {
              userState: of(null),
              userChanged: of(undefined),
              currentUserID: undefined,
            },
            spaceNavService: {
              navigateForwardToSpacePage: vi.fn(),
            },
            preloader: {
              preload: vi.fn(),
              markAsPreloaded: vi.fn(),
            },
          },
        },
      ],
    })
      .overrideComponent(DiscoverMoviesPageComponent, {
        set: {
          imports: [],
          providers: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DiscoverMoviesPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('identify()', () => {
    it('does not call the API for a blank description', () => {
      component['$description'].set('   ');
      component['identify']();
      expect(identifyMovies).not.toHaveBeenCalled();
    });

    it('loads candidates for a description', () => {
      component['$description'].set(' that movie about a chef ');
      component['identify']();
      expect(identifyMovies).toHaveBeenCalledWith({
        description: 'that movie about a chef',
      });
      expect(component['$candidates']()).toEqual(candidates);
      expect(component['$isIdentifying']()).toBe(false);
      expect(component['$identifyError']()).toBeUndefined();
    });

    it('treats a missing movies array as an empty result', () => {
      identifyMovies.mockReturnValueOnce(of({}));
      component['$description'].set('some movie');
      component['identify']();
      expect(component['$candidates']()).toEqual([]);
    });

    it('shows an error state when the API call fails', () => {
      identifyMovies.mockReturnValueOnce(throwError(() => new Error('boom')));
      component['$description'].set('some movie');
      component['identify']();
      expect(component['$identifyError']()).toBeTruthy();
      expect(component['$isIdentifying']()).toBe(false);
      expect(logError).toHaveBeenCalled();
    });
  });

  describe('addToWatchlist()', () => {
    const movie = candidates[0];
    const event = () => new Event('click');

    it('does nothing without a space in context', () => {
      component['addToWatchlist'](event(), movie);
      expect(addMovieToWatchlist).not.toHaveBeenCalled();
    });

    it('adds the movie and marks it as on the list', () => {
      component['$spaceRef'].set({ id: 'space1', type: 'family' });
      component['addToWatchlist'](event(), movie);
      expect(addMovieToWatchlist).toHaveBeenCalledWith({
        spaceID: 'space1',
        tmdbID: movie.tmdbID,
      });
      expect(component['isOnWatchlist'](movie)).toBe(true);
      expect(component['isAdding'](movie)).toBe(false);
      expect(toastCreate).toHaveBeenCalled();
    });

    it('does not re-add a movie that is already on the list', () => {
      component['$spaceRef'].set({ id: 'space1', type: 'family' });
      component['$watchlistTmdbIDs'].set(new Set([movie.tmdbID]));
      component['addToWatchlist'](event(), movie);
      expect(addMovieToWatchlist).not.toHaveBeenCalled();
    });

    it('clears the in-progress state and keeps the movie addable on failure', () => {
      addMovieToWatchlist.mockReturnValueOnce(
        throwError(() => new Error('boom')),
      );
      component['$spaceRef'].set({ id: 'space1', type: 'family' });
      component['addToWatchlist'](event(), movie);
      expect(component['isAdding'](movie)).toBe(false);
      expect(component['isOnWatchlist'](movie)).toBe(false);
      expect(logError).toHaveBeenCalled();
      expect(toastCreate).toHaveBeenCalled(); // error toast
    });
  });

  describe('toggleDetails()', () => {
    const movie = candidates[0];

    it('expands a candidate and lazily loads its overview', () => {
      component['toggleDetails'](movie);
      expect(component['$expandedTmdbID']()).toBe(movie.tmdbID);
      expect(resolveMovie).toHaveBeenCalledWith({ tmdbID: movie.tmdbID });
      expect(component['$overviewByTmdbID']().get(movie.tmdbID)).toBe(
        'A thief…',
      );
    });

    it('collapses on second toggle without re-fetching', () => {
      component['toggleDetails'](movie);
      component['toggleDetails'](movie);
      expect(component['$expandedTmdbID']()).toBeUndefined();
      expect(resolveMovie).toHaveBeenCalledTimes(1);
    });
  });
});
