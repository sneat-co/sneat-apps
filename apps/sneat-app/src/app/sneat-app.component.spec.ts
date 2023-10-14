import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { SneatAppComponent } from './sneat-app.component';

describe('AppComponent', () => {
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SneatAppComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(SneatAppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
	// TODO: add more tests!
});
