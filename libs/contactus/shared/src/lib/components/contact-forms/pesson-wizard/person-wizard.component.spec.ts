import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { SpaceNavService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';

import { PersonWizardComponent } from './person-wizard.component';

describe('PersonWizardComponent', () => {
	let component: PersonWizardComponent;
	let fixture: ComponentFixture<PersonWizardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [PersonWizardComponent, NoopAnimationsModule],
			providers: [
				{ provide: ClassName, useValue: 'PersonWizardComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: SpaceNavService, useValue: {} },
				{
					provide: SneatUserService,
					useValue: { userState: of({}), userChanged: of(undefined) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(PersonWizardComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PersonWizardComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$contact', {
			id: '',
			space: { id: 'test-space' },
			dbo: { type: 'person' },
		});
		fixture.componentRef.setInput('$fields', {});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
