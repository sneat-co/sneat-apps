import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MemberNewPageComponent} from './member-new-page.component';

describe('MemberNewPage', () => {
	let component: MemberNewPageComponent;
	let fixture: ComponentFixture<MemberNewPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MemberNewPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MemberNewPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
