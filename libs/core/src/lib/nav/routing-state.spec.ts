import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subject } from 'rxjs';
import { RoutingState } from './routing-state';

describe('RoutingState', () => {
  let eventsSubject: Subject<Event>;

  beforeEach(() => {
    eventsSubject = new Subject();
    TestBed.configureTestingModule({
      providers: [
        RoutingState,
        {
          provide: Router,
          useValue: { events: eventsSubject },
        },
      ],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(RoutingState);
    expect(service).toBeTruthy();
  });

  it('should return false when no history exists', () => {
    const service = TestBed.inject(RoutingState);
    expect(service.hasHistory()).toBe(false);
  });

  it('should return false after one navigation', () => {
    const service = TestBed.inject(RoutingState);
    const navEnd = new NavigationEnd(1, '/home', '/home');
    eventsSubject.next(navEnd);
    expect(service.hasHistory()).toBe(false);
  });

  it('should return true after two navigations', () => {
    const service = TestBed.inject(RoutingState);

    const navEnd1 = new NavigationEnd(1, '/home', '/home');
    eventsSubject.next(navEnd1);

    const navEnd2 = new NavigationEnd(2, '/about', '/about');
    eventsSubject.next(navEnd2);

    expect(service.hasHistory()).toBe(true);
  });

  it('should handle multiple navigations', () => {
    const service = TestBed.inject(RoutingState);

    const navEnd1 = new NavigationEnd(1, '/home', '/home');
    eventsSubject.next(navEnd1);

    const navEnd2 = new NavigationEnd(2, '/about', '/about');
    eventsSubject.next(navEnd2);

    const navEnd3 = new NavigationEnd(3, '/contact', '/contact');
    eventsSubject.next(navEnd3);

    expect(service.hasHistory()).toBe(true);
  });
});
