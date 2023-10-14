import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterItemComponent } from './filter-item.component';

describe('FilterItemComponent', () => {
	let component: FilterItemComponent;
	let fixture: ComponentFixture<FilterItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FilterItemComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FilterItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
