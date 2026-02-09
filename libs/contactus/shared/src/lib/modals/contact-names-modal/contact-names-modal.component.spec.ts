import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { ModalController } from '@ionic/angular/standalone';
import { ContactService } from '@sneat/contactus-services';

import { ContactNamesModalComponent } from './contact-names-modal.component';

// Mock browser global 'personalbar' which does not exist in happy-dom
(globalThis as Record<string, unknown>)['personalbar'] = {};

describe('ContactNamesModalComponent', () => {
	let component: ContactNamesModalComponent;
	let fixture: ComponentFixture<ContactNamesModalComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContactNamesModalComponent],
			providers: [
				{ provide: ClassName, useValue: 'ContactNamesModalComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: ModalController,
					useValue: { dismiss: vi.fn(), create: vi.fn() },
				},
				{ provide: ContactService, useValue: { updateContact: vi.fn() } },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ContactNamesModalComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactNamesModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
