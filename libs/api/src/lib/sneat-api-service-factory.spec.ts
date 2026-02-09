import { TestBed } from '@angular/core/testing';
import { SneatApiServiceFactory } from './sneat-api-service-factory';

describe('SneatApiServiceFactory', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SneatApiServiceFactory],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(SneatApiServiceFactory)).toBeTruthy();
	});
});
