import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { SneatNavService } from './sneat-nav.service';

describe('SneatNavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SneatNavService,
        {
          provide: Router,
          useValue: { events: new Subject() },
        },
        { provide: Location, useValue: { back: vi.fn() } },
        { provide: NavController, useValue: { pop: vi.fn() } },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(SneatNavService)).toBeTruthy();
  });

  it('should navigateByUrl when no previous page exists', () => {
    const service = TestBed.inject(SneatNavService);
    const router = TestBed.inject(Router);
    router.navigateByUrl = vi.fn().mockReturnValue(Promise.resolve(true));

    service.goBack('/home');

    expect(router.navigateByUrl).toHaveBeenCalledWith('/home', undefined);
  });

  it('should call navController.pop when previous page exists', async () => {
    const router = TestBed.inject(Router);
    const eventsSubject = router.events as Subject<Event>;
    const service = TestBed.inject(SneatNavService);

    // Simulate navigation end
    const navEnd = new NavigationEnd(1, '/prev', '/prev');
    eventsSubject.next(navEnd);

    const navController = TestBed.inject(NavController);
    navController.pop = vi.fn().mockReturnValue(Promise.resolve(true));

    service.goBack('/home');

    expect(navController.pop).toHaveBeenCalled();
  });

  it('should call location.back when navController.pop fails', async () => {
    const router = TestBed.inject(Router);
    const eventsSubject = router.events as Subject<Event>;
    const service = TestBed.inject(SneatNavService);

    // Simulate navigation end
    const navEnd = new NavigationEnd(1, '/prev', '/prev');
    eventsSubject.next(navEnd);

    const navController = TestBed.inject(NavController);
    navController.pop = vi.fn().mockReturnValue(Promise.resolve(false));
    const location = TestBed.inject(Location);

    service.goBack('/home');

    // Wait for promise
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(location.back).toHaveBeenCalled();
  });

  it('should handle navigation error when no previous page exists', async () => {
    const service = TestBed.inject(SneatNavService);
    const router = TestBed.inject(Router);
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const error = new Error('Navigation failed');
    router.navigateByUrl = vi.fn().mockReturnValue(Promise.reject(error));

    service.goBack('/home');

    // Wait for promise to reject
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'SneatNavService.goBack() - failed to navigate',
      error,
    );
    consoleErrorSpy.mockRestore();
  });
});
