import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsComponent } from './participants.component';

describe('ParticipantsComponent', () => {
	let component: ParticipantsComponent;
	let fixture: ComponentFixture<ParticipantsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ParticipantsComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ParticipantsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
