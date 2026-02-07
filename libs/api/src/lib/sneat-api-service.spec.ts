import {
	HttpClientTestingModule,
	HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import {
	DefaultSneatAppApiBaseUrl,
	SneatApiBaseUrl,
	SneatApiService,
} from './sneat-api-service';
import { Auth, onIdTokenChanged } from '@angular/fire/auth';

jest.mock('@angular/fire/auth', () => ({
	onIdTokenChanged: jest.fn(),
	Auth: class {},
}));

const NOT_AUTHENTICATED_ERROR =
	'User is not authenticated yet - no Firebase ID token';

describe('SneatApiService', () => {
	let httpMock: HttpTestingController;
	let service: SneatApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				SneatApiService,
				{ provide: SneatApiBaseUrl, useValue: undefined },
				{ provide: Auth, useValue: {} },
			],
		});

		httpMock = TestBed.inject(HttpTestingController);
		service = TestBed.inject(SneatApiService);
	});

	afterEach(() => {
		httpMock.verify();
		jest.clearAllMocks();
	});

	it('registers for ID token changes on construction', () => {
		expect(onIdTokenChanged).toHaveBeenCalledTimes(1);
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
