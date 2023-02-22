import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddToWatchPageComponent} from './add-to-watch-page.component';

describe('AddToWatchPage', () => {
	let component: AddToWatchPageComponent;
	let fixture: ComponentFixture<AddToWatchPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AddToWatchPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddToWatchPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
