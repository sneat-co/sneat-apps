import { TestBed } from '@angular/core/testing';

import { MemberGroupService } from './member-group.service';

describe('MemberGroupService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: MemberGroupService = TestBed.inject(MemberGroupService);
		expect(service).toBeTruthy();
	});
});
