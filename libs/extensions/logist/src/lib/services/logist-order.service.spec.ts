import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { LogistOrderService } from './logist-order.service';

vi.mock('@angular/fire/firestore');

describe('LogistOrderService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				LogistOrderService,
				{
					provide: SneatApiService,
					useValue: {
						post: vi.fn(() => of({})),
						get: vi.fn(() => of({})),
						delete: vi.fn(() => of({})),
					},
				},
				{
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(LogistOrderService)).toBeTruthy();
	});
});
