import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactPageComponent } from './contact-page.component';
import { provideContactusMocks } from '../../testing/test-utils';

describe('CommuneContactPage', () => {
	let component: ContactPageComponent;
	let fixture: ComponentFixture<ContactPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContactPageComponent],
			providers: [provideContactusMocks()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ContactPageComponent, {
				set: { imports: [], providers: [] },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactPageComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
