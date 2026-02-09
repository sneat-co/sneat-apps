import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewLocationPageComponent } from './new-location-page.component';
import { provideContactusMocks } from '../../testing/test-utils';

describe('NewLocationPageComponent', () => {
	let component: NewLocationPageComponent;
	let fixture: ComponentFixture<NewLocationPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [NewLocationPageComponent],
			providers: [provideContactusMocks()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(NewLocationPageComponent, {
				set: { imports: [], providers: [] },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewLocationPageComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
