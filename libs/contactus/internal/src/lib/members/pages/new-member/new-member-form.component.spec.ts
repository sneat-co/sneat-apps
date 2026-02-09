import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewMemberFormComponent } from './new-member-form.component';
import { provideContactusMocks } from '../../../testing/test-utils';
import { MemberService } from '@sneat/contactus-services';
import { of } from 'rxjs';

describe('NewMemberFormComponent', () => {
	let component: NewMemberFormComponent;
	let fixture: ComponentFixture<NewMemberFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [NewMemberFormComponent],
			providers: [
				...provideContactusMocks(),
				{
					provide: MemberService,
					useValue: { createMember: vi.fn(() => of({})) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(NewMemberFormComponent, {
				set: {
					imports: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					template: '',
				},
			})
			.compileComponents();
		fixture = TestBed.createComponent(NewMemberFormComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$contact', {
			space: { id: 'test-space' },
			dbo: { type: 'person', gender: 'unknown' },
		});
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
