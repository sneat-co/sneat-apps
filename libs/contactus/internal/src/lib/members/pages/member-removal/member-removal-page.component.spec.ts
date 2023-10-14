import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRemovalPageComponent } from './member-removal-page.component';

describe('MemberRemovalPage', () => {
	let component: MemberRemovalPageComponent;
	let fixture: ComponentFixture<MemberRemovalPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MemberRemovalPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MemberRemovalPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
