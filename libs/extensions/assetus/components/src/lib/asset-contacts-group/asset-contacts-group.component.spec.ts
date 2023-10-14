import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetContactsGroupComponent } from './asset-contacts-group.component';

describe('AssetContactsGroupComponent', () => {
	let component: AssetContactsGroupComponent;
	let fixture: ComponentFixture<AssetContactsGroupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetContactsGroupComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetContactsGroupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
