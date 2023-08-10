import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MemberAssetsPageComponent} from './member-assets-page-components.component';

describe('MemberAssetsPage', () => {
	let component: MemberAssetsPageComponent;
	let fixture: ComponentFixture<MemberAssetsPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MemberAssetsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MemberAssetsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
