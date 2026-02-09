import { TestBed } from '@angular/core/testing';
import { SpaceNavService } from '@sneat/space-services';
import { ContactusNavService } from './contactus-nav.service';

describe('ContactusNavService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				ContactusNavService,
				{
					provide: SpaceNavService,
					useValue: { navigateForwardToSpacePage: vi.fn() },
				},
			],
		}),
	);

	it('should be created', () => {
		expect(TestBed.inject(ContactusNavService)).toBeTruthy();
	});
});
