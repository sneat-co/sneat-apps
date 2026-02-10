import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { AssetService } from './asset-service.service';

describe('AssetService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				AssetService,
				{ provide: SneatApiService, useValue: { post: vi.fn() } },
			],
		}),
	);

	it('should be created', () => {
		expect(TestBed.inject(AssetService)).toBeTruthy();
	});

	// Add specific test cases for your service methods
	// Example:
	// it('should handle API calls', () => {
	//   const service = TestBed.inject(AssetService);
	//   // Test your service logic
	// });
});
