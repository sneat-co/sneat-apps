import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { ContactService } from '@sneat/contactus-services';

import { ContactPhonesComponent } from './contact-phones.component';

describe('ContactPhonesComponent', () => {
	let component: ContactPhonesComponent;
	let fixture: ComponentFixture<ContactPhonesComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContactPhonesComponent],
			providers: [
				{ provide: ClassName, useValue: 'ContactPhonesComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: ContactService,
					useValue: { addContactCommChannel: vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ContactPhonesComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactPhonesComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$contact', {
			id: 'test',
			space: { id: 'test-space' },
			dbo: {},
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
