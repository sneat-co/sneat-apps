import { TestBed } from '@angular/core/testing';
import { ContactRoleService } from './contact-role.service';

describe('ContactRoleService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [ContactRoleService],
		}),
	);

	it('should be created', () => {
		expect(TestBed.inject(ContactRoleService)).toBeTruthy();
	});
});
