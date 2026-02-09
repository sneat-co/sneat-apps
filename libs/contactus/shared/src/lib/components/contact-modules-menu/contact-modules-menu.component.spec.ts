import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { SpaceNavService } from '@sneat/space-services';

import { ContactModulesMenuComponent } from './contact-modules-menu.component';

describe('ContactModulesMenuComponent', () => {
	let component: ContactModulesMenuComponent;
	let fixture: ComponentFixture<ContactModulesMenuComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContactModulesMenuComponent],
			providers: [
				{ provide: ClassName, useValue: 'ContactModulesMenuComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: SpaceNavService, useValue: {} },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ContactModulesMenuComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactModulesMenuComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
