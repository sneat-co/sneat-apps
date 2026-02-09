import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MemberRemovalPageComponent } from './member-removal-page.component';
import { provideContactusMocks } from '../../../testing/test-utils';

describe('MemberRemovalPage', () => {
	let component: MemberRemovalPageComponent;
	let fixture: ComponentFixture<MemberRemovalPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MemberRemovalPageComponent],
			providers: [provideContactusMocks()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(MemberRemovalPageComponent, {
				set: { imports: [], providers: [] },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MemberRemovalPageComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
