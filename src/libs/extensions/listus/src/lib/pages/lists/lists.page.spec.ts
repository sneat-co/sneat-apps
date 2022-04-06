import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListsPageComponent} from './lists.page';

describe('ListsPage', () => {
	let component: ListsPageComponent;
	let fixture: ComponentFixture<ListsPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ListsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ListsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
