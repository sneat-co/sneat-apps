import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityNewPageComponent } from './liability-new-page.component';

describe('LiabilityNewPage', () => {
	let component: LiabilityNewPageComponent;
	let fixture: ComponentFixture<LiabilityNewPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LiabilityNewPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LiabilityNewPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
