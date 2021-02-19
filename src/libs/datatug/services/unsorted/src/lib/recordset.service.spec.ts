import {TestBed} from '@angular/core/testing';

import {RecordsetService} from './recordset.service';

describe('RecordsetService', () => {
	let service: RecordsetService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RecordsetService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
