import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewContactPageComponent } from './new-contact-page.component';
import { provideContactusMocks } from '../../testing/test-utils';

describe('ContactNewPage', () => {
	let component: NewContactPageComponent;
	let fixture: ComponentFixture<NewContactPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [NewContactPageComponent],
			providers: [provideContactusMocks()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(NewContactPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewContactPageComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
