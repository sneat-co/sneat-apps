import { CapacitorHttpInterceptor } from './capacitator-http.service';
import {
	HttpRequest,
	HttpResponse,
	HttpErrorResponse,
} from '@angular/common/http';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { firstValueFrom, of } from 'rxjs';

vi.mock('@capacitor/core', () => ({
	Capacitor: {
		isNativePlatform: vi.fn(),
	},
	CapacitorHttp: {
		request: vi.fn(),
	},
}));

describe('CapacitorHttpInterceptor', () => {
	let interceptor: CapacitorHttpInterceptor;
	let nextHandler: any;

	beforeEach(() => {
		interceptor = new CapacitorHttpInterceptor();
		nextHandler = {
			handle: vi.fn().mockReturnValue(of(new HttpResponse())),
		};
	});

	it('should use standard Angular HTTP for web', async () => {
		(Capacitor.isNativePlatform as any).mockReturnValue(false);
		const req = new HttpRequest('GET', 'https://example.com');
		await firstValueFrom(interceptor.intercept(req, nextHandler));
		expect(nextHandler.handle).toHaveBeenCalledWith(req);
	});

	it('should use Capacitor HTTP for native platform', async () => {
		(Capacitor.isNativePlatform as any).mockReturnValue(true);
		const req = new HttpRequest('GET', 'https://example.com');
		const mockResponse = { status: 200, data: { message: 'success' } };
		(CapacitorHttp.request as any).mockResolvedValue(mockResponse);

		const event: any = await firstValueFrom(
			interceptor.intercept(req, nextHandler),
		);
		expect(event instanceof HttpResponse).toBe(true);
		expect(event.status).toBe(200);
		expect(event.body).toEqual({ message: 'success' });
	});

	it('should handle Capacitor HTTP errors', async () => {
		(Capacitor.isNativePlatform as any).mockReturnValue(true);
		const req = new HttpRequest('GET', 'https://example.com');
		const mockError = { status: 404, error: 'Not Found' };
		(CapacitorHttp.request as any).mockRejectedValue(mockError);

		try {
			await firstValueFrom(interceptor.intercept(req, nextHandler));
			throw new Error('should have thrown an error');
		} catch (error: any) {
			expect(error instanceof HttpErrorResponse).toBe(true);
			expect(error.status).toBe(404);
			expect(error.statusText).toBe('Not Found');
		}
	});
});
