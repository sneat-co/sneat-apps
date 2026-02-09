import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { UserRecordService } from './user-record.service';

describe('UserRecordService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UserRecordService,
				{
					provide: SneatApiService,
					useValue: { post: vi.fn() },
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(UserRecordService)).toBeTruthy();
	});
});
