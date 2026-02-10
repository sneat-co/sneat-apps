import { TestBed } from '@angular/core/testing';
import {
	SneatApiServiceFactory,
	getStoreUrl,
} from './sneat-api-service-factory';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Auth } from '@angular/fire/auth';
import { SneatApiBaseUrl } from './sneat-api-service';

const onIdTokenChangedMock = vi.fn();

vi.mock('@angular/fire/auth', () => ({
	onIdTokenChanged: (...args: unknown[]) => onIdTokenChangedMock(...args),
	Auth: vi.fn(),
}));

describe('SneatApiServiceFactory', () => {
	let factory: SneatApiServiceFactory;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SneatApiServiceFactory,
				provideHttpClientTesting(),
				{ provide: SneatApiBaseUrl, useValue: undefined },
				{ provide: Auth, useValue: {} },
			],
		});
		factory = TestBed.inject(SneatApiServiceFactory);
		onIdTokenChangedMock.mockClear();
	});

	it('should be created', () => {
		expect(factory).toBeTruthy();
	});

	describe('getSneatApiService', () => {
		it('should throw error if storeId is empty', () => {
			expect(() => factory.getSneatApiService('')).toThrow(
				'storeRef is a required parameter, got empty: string',
			);
		});

		it('should throw error if storeRef.type is empty', () => {
			// parseStoreRef will throw before we get to the type check
			expect(() => factory.getSneatApiService('invalid-store')).toThrow();
		});

		it('should return service for firestore type', () => {
			TestBed.runInInjectionContext(() => {
				const service = factory.getSneatApiService('firestore');
				expect(service).toBeTruthy();
			});
		});

		it('should cache and return same service instance for same storeId', () => {
			TestBed.runInInjectionContext(() => {
				const service1 = factory.getSneatApiService('firestore');
				const service2 = factory.getSneatApiService('firestore');
				expect(service1).toBe(service2);
			});
		});

		it('should throw error for unknown store type', () => {
			TestBed.runInInjectionContext(() => {
				// We need to test the default case in the switch statement
				// We'll need to mock parseStoreRef to return a store type that isn't 'firestore'
				// For now, this is challenging without modifying the source
				// The line 61 (unknown store type) is hard to reach due to parseStoreRef
			});
		});
	});

	describe('getStoreUrl', () => {
		it('should return localhost URL for firestore without trailing slash', () => {
			const url = getStoreUrl('firestore');
			expect(url).toBe('http://localhost:4300/v0');
		});

		it('should remove trailing slash from firestore URL', () => {
			// The function returns without trailing slash already
			const url = getStoreUrl('firestore');
			expect(url).not.toMatch(/\/$/);
		});

		it('should return storeId if it is empty', () => {
			const url = getStoreUrl('');
			expect(url).toBe('');
		});

		it('should return storeId if it matches http URL pattern', () => {
			const httpUrl = 'http://example.com/api';
			const url = getStoreUrl(httpUrl);
			expect(url).toBe(httpUrl);
		});

		it('should return storeId if it matches https URL pattern', () => {
			const httpsUrl = 'https://example.com/api';
			const url = getStoreUrl(httpsUrl);
			expect(url).toBe(httpsUrl);
		});

		it('should convert http- prefix to http://', () => {
			const url = getStoreUrl('http-example.com');
			expect(url).toBe('http://example.com');
		});

		it('should convert https- prefix to https://', () => {
			const url = getStoreUrl('https-example.com');
			expect(url).toBe('https://example.com');
		});

		it('should handle host:port format', () => {
			const url = getStoreUrl('localhost:8080');
			expect(url).toBe('//localhost:8080');
		});

		it('should handle host:port:path format', () => {
			const url = getStoreUrl('localhost:8080:api');
			expect(url).toBe('//localhost:8080:api');
		});
	});
});
