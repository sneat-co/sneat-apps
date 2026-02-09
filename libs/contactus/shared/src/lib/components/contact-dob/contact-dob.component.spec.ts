import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { ContactService } from '@sneat/contactus-services';

import { ContactDobComponent } from './contact-dob.component';

describe('ContactDobComponent', () => {
	let component: ContactDobComponent;
	let fixture: ComponentFixture<ContactDobComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContactDobComponent],
			providers: [
				{ provide: ClassName, useValue: 'ContactDobComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: ContactService, useValue: { updateContact: vi.fn() } },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ContactDobComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactDobComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$contact', {
			id: 'test',
			space: { id: 'test-space' },
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
