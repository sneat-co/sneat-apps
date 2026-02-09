import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewMemberPageComponent } from './new-member-page.component';
import { provideContactusMocks } from '../../../testing/test-utils';

describe('MemberNewPage', () => {
	let component: NewMemberPageComponent;
	let fixture: ComponentFixture<NewMemberPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [NewMemberPageComponent],
			providers: [provideContactusMocks()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(NewMemberPageComponent, {
				set: { imports: [], providers: [] },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewMemberPageComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
