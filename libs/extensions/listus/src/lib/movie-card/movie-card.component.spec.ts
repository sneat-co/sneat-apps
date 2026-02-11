import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListusComponentBaseParams } from '../listus-component-base-params';
import { ITmdbService } from '../watchlist';
import { of } from 'rxjs';

import { MovieCardComponent } from './movie-card.component';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ListusComponentBaseParams,
          useValue: {
            spaceParams: {
              userService: {
                currentUserID: undefined,
                userState: of(null),
                userChanged: of(undefined),
              },
              errorLogger: {
                logError: vi.fn(),
                logErrorHandler: () => vi.fn(),
              },
              loggerFactory: { getLogger: () => console },
              spaceNavService: {
                navigateForwardToSpacePage: vi.fn(),
              },
              preloader: { preload: vi.fn() },
            },
            listService: {},
          },
        },
        {
          provide: ITmdbService,
          useValue: {
            searchMovies: vi.fn(),
            loadMovieInfoById: vi.fn(),
          },
        },
      ],
    })
      .overrideComponent(MovieCardComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
