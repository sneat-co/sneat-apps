import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddToWatchPage} from './add-to-watch.page';

describe('AddToWatchPage', () => {
	let component: AddToWatchPage;
	let fixture: ComponentFixture<AddToWatchPage>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AddToWatchPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddToWatchPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
