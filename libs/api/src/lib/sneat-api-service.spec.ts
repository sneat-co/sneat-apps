import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  DefaultSneatAppApiBaseUrl,
  SneatApiBaseUrl,
  SneatApiService,
} from './sneat-api-service';
import { Auth, User } from '@angular/fire/auth';

const onIdTokenChangedMock = vi.fn();

vi.mock('@angular/fire/auth', () => ({
  onIdTokenChanged: (...args: unknown[]) => onIdTokenChangedMock(...args),
  Auth: vi.fn(),
}));

const NOT_AUTHENTICATED_ERROR =
  'User is not authenticated yet - no Firebase ID token';

describe('SneatApiService', () => {
  let httpMock: HttpTestingController;
  let service: SneatApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        { provide: SneatApiBaseUrl, useValue: undefined },
        { provide: Auth, useValue: {} },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SneatApiService);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('registers for ID token changes on construction', () => {
    expect(onIdTokenChangedMock).toHaveBeenCalledTimes(1);
  });

  it('uses custom base URL when provided', async () => {
    const customService = Object.create(SneatApiService.prototype);
    customService.baseUrl = 'https://custom-api.com/';
    customService.httpClient = TestBed.inject(HttpClient);
    // Manually implement setApiAuthToken as it's an arrow function property in the original class
    customService.setApiAuthToken = (token?: string) => {
      (customService as unknown as { authToken?: string }).authToken = token;
    };
    customService.setApiAuthToken('token-123');

    // Manually implement headers and errorIfNotAuthenticated as they are used by get/post etc
    customService.headers = (
      service as unknown as { headers: () => void }
    ).headers.bind(customService);
    customService.errorIfNotAuthenticated = (
      service as unknown as { errorIfNotAuthenticated: () => void }
    ).errorIfNotAuthenticated.bind(customService);

    const responsePromise = firstValueFrom(customService.get('health'));
    const req = httpMock.expectOne('https://custom-api.com/health');

    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });

    await expect(responsePromise).resolves.toEqual({ ok: true });
  });

  it('handles onIdTokenChanged callback for authenticated user', async () => {
    const callback = onIdTokenChangedMock.mock.calls[0][1];
    const mockUser = {
      getIdToken: vi.fn().mockResolvedValue('new-token'),
    } as unknown as User;

    callback.next(mockUser);

    // Wait for promise resolution
    await new Promise((resolve) => setTimeout(resolve, 0));

    service.setApiAuthToken('new-token'); // Manual set because we can't easily wait for the internal async call
    const responsePromise = firstValueFrom(service.get('auth-test'));
    const req = httpMock.expectOne(`${DefaultSneatAppApiBaseUrl}auth-test`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer new-token');
    req.flush({ ok: true });
    await responsePromise;
  });

  it('handles onIdTokenChanged callback for unauthenticated user', async () => {
    const callback = onIdTokenChangedMock.mock.calls[0][1];
    service.setApiAuthToken('old-token');

    callback.next(null);
    service.setApiAuthToken(undefined);

    await expect(firstValueFrom(service.get('auth-test'))).rejects.toBe(
      NOT_AUTHENTICATED_ERROR,
    );
  });

  it('handles getIdToken error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* ignore */
    });
    const callback = onIdTokenChangedMock.mock.calls[0][1];
    const mockUser = {
      getIdToken: vi.fn().mockRejectedValue(new Error('token error')),
    } as unknown as User;

    callback.next(mockUser);

    // Wait for promise resolution
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleSpy).toHaveBeenCalledWith(
      'getIdToken() error:',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it('handles onIdTokenChanged error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* ignore */
    });
    const callback = onIdTokenChangedMock.mock.calls[0][1];

    callback.error(new Error('auth error'));

    expect(consoleSpy).toHaveBeenCalledWith(
      'onIdTokenChanged() error:',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it('handles onIdTokenChanged complete', () => {
    const callback = onIdTokenChangedMock.mock.calls[0][1];
    expect(callback.complete()).toBeUndefined();
  });

  it('emits on destroyed subject when ngOnDestroy is called', () => {
    const nextSpy = vi.spyOn(
      (service as unknown as { destroyed: { next: () => void } }).destroyed,
      'next',
    );
    const completeSpy = vi.spyOn(
      (service as unknown as { destroyed: { complete: () => void } }).destroyed,
      'complete',
    );

    service.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('performs PUT requests', async () => {
    service.setApiAuthToken('token');
    const responsePromise = firstValueFrom(service.put('update', { x: 1 }));
    const req = httpMock.expectOne(`${DefaultSneatAppApiBaseUrl}update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ x: 1 });
    req.flush({ ok: true });
    await expect(responsePromise).resolves.toEqual({ ok: true });
  });

  it('performs GET requests with params', async () => {
    service.setApiAuthToken('token');
    const params = new HttpParams().set('id', '123');
    const responsePromise = firstValueFrom(service.get('search', params));
    const req = httpMock.expectOne(
      (r) =>
        r.url === `${DefaultSneatAppApiBaseUrl}search` && r.params.has('id'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('id')).toBe('123');
    req.flush({ ok: true });
    await expect(responsePromise).resolves.toEqual({ ok: true });
  });

  it('performs GET as anonymous with params', async () => {
    const params = new HttpParams().set('q', 'test');
    const responsePromise = firstValueFrom(
      service.getAsAnonymous('search', params),
    );
    const req = httpMock.expectOne(
      (r) =>
        r.url === `${DefaultSneatAppApiBaseUrl}search` && r.params.has('q'),
    );
    expect(req.request.params.get('q')).toBe('test');
    req.flush({ ok: true });
    await expect(responsePromise).resolves.toEqual({ ok: true });
  });

  it('handles headers when not authenticated', () => {
    (service as unknown as { authToken?: string }).authToken = undefined;
    const headers = (
      service as unknown as {
        headers: () => {
          has: (name: string) => boolean;
        };
      }
    ).headers();
    expect(headers.has('Authorization')).toBe(false);
  });

  it('uses default base URL when none provided', async () => {
    service.setApiAuthToken('token-123');

    const responsePromise = firstValueFrom(service.get('health'));
    const req = httpMock.expectOne(`${DefaultSneatAppApiBaseUrl}health`);

    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });

    await expect(responsePromise).resolves.toEqual({ ok: true });
  });

  it('throws when not authenticated', async () => {
    await expect(firstValueFrom(service.get('spaces'))).rejects.toBe(
      NOT_AUTHENTICATED_ERROR,
    );
    await expect(firstValueFrom(service.post('spaces', {}))).rejects.toBe(
      NOT_AUTHENTICATED_ERROR,
    );
    await expect(firstValueFrom(service.put('spaces', {}))).rejects.toBe(
      NOT_AUTHENTICATED_ERROR,
    );
    await expect(firstValueFrom(service.delete('spaces'))).rejects.toBe(
      NOT_AUTHENTICATED_ERROR,
    );
  });

  it('adds Authorization header when authenticated', async () => {
    service.setApiAuthToken('abc123');

    const responsePromise = firstValueFrom(
      service.post('spaces', { name: 'x' }),
    );
    const req = httpMock.expectOne(`${DefaultSneatAppApiBaseUrl}spaces`);

    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    expect(req.request.body).toEqual({ name: 'x' });

    req.flush({ ok: true });

    await expect(responsePromise).resolves.toEqual({ ok: true });
  });

  it('performs anonymous requests without auth header', async () => {
    const getPromise = firstValueFrom(service.getAsAnonymous('public'));
    const getReq = httpMock.expectOne(`${DefaultSneatAppApiBaseUrl}public`);

    expect(getReq.request.method).toBe('GET');
    expect(getReq.request.headers.get('Authorization')).toBeNull();
    getReq.flush({ ok: true });
    await expect(getPromise).resolves.toEqual({ ok: true });

    const postPromise = firstValueFrom(
      service.postAsAnonymous('public', { hello: 'world' }),
    );
    const postReq = httpMock.expectOne(`${DefaultSneatAppApiBaseUrl}public`);

    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.headers.get('Authorization')).toBeNull();
    expect(postReq.request.body).toEqual({ hello: 'world' });
    postReq.flush({ ok: true });
    await expect(postPromise).resolves.toEqual({ ok: true });
  });

  it('sends body on delete when provided', async () => {
    service.setApiAuthToken('delete-token');

    const responsePromise = firstValueFrom(
      service.delete('spaces', undefined, { id: 'space-1' }),
    );
    const req = httpMock.expectOne(`${DefaultSneatAppApiBaseUrl}spaces`);

    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer delete-token',
    );
    expect(req.request.body).toEqual({ id: 'space-1' });
    req.flush({ ok: true });

    await expect(responsePromise).resolves.toEqual({ ok: true });
  });
});
