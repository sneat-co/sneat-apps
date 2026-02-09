import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { TrackusSpaceService } from './trackus-space.service';

vi.mock('@angular/fire/firestore', () => ({
	collection: vi.fn(),
	Firestore: vi.fn(),
}));

describe('TrackusSpaceService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [TrackusSpaceService, { provide: Firestore, useValue: {} }],
		}),
	);

	it('should be created', () => {
		expect(TestBed.inject(TrackusSpaceService)).toBeTruthy();
	});
});
