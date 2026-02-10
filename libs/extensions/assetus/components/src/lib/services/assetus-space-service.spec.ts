import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { AssetusSpaceService } from './assetus-space-service.service';

describe('AssetusSpaceService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				AssetusSpaceService,
				{ provide: SneatApiService, useValue: { post: vi.fn() } },
			],
		}),
	);

	it('should be created', () => {
		expect(TestBed.inject(AssetusSpaceService)).toBeTruthy();
	});

	// Add specific test cases for your service methods
	// Example:
	// it('should handle API calls', () => {
	//   const service = TestBed.inject(AssetusSpaceService);
	//   // Test your service logic
	// });
});
