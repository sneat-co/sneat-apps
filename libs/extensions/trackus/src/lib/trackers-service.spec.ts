import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { TrackersService } from './trackers-service';

vi.mock('@angular/fire/firestore', () => ({
	collection: vi.fn(),
	Firestore: vi.fn(),
}));

describe('TrackersService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				TrackersService,
				{ provide: Firestore, useValue: {} },
				{ provide: SneatApiService, useValue: { post: vi.fn() } },
			],
		}),
	);

	it('should be created', () => {
		expect(TestBed.inject(TrackersService)).toBeTruthy();
	});
});
