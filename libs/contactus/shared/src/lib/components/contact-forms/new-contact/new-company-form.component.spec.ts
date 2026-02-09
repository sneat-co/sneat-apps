import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { SpaceNavService } from '@sneat/space-services';
import { ContactService } from '@sneat/contactus-services';

import { NewCompanyFormComponent } from './new-company-form.component';

describe('NewCompanyFormComponent', () => {
	let component: NewCompanyFormComponent;
	let fixture: ComponentFixture<NewCompanyFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [NewCompanyFormComponent],
			providers: [
				{ provide: ClassName, useValue: 'NewCompanyFormComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: SpaceNavService, useValue: {} },
				{ provide: ContactService, useValue: { createContact: vi.fn() } },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(NewCompanyFormComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewCompanyFormComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$contact', {
			id: '',
			space: { id: 'test-space' },
			dbo: { type: 'company' },
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
