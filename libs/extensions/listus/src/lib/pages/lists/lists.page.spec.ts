import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListsPageComponent } from './lists.page';

describe('ListsPage', () => {
	let component: ListsPageComponent;
	let fixture: ComponentFixture<ListsPageComponent>;

	beforeEach(waitForAsync(async () => {
		TestBed.configureTestingModule({
			declarations: [ListsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ListsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
