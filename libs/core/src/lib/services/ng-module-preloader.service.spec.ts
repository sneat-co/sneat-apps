import { TestBed } from '@angular/core/testing';

import { NgModulePreloaderService } from './ng-module-preloader.service';

describe('NgModulePreloaderService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: NgModulePreloaderService = TestBed.inject(
			NgModulePreloaderService,
		);
		expect(service).toBeTruthy();
	});
});
