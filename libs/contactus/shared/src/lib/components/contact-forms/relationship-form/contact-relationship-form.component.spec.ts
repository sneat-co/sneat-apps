import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { SpaceNavService, SpaceService } from '@sneat/space-services';

import { ContactRelationshipFormComponent } from './contact-relationship-form.component';

describe('ContactRelationshipFormComponent', () => {
	let component: ContactRelationshipFormComponent;
	let fixture: ComponentFixture<ContactRelationshipFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContactRelationshipFormComponent],
			providers: [
				{ provide: ClassName, useValue: 'ContactRelationshipFormComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: SpaceNavService, useValue: {} },
				{ provide: SpaceService, useValue: { updateRelated: vi.fn() } },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ContactRelationshipFormComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactRelationshipFormComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$contactID', 'test-contact');
		fixture.componentRef.setInput('$ageGroup', undefined);
		fixture.componentRef.setInput('$relatedTo', undefined);
		fixture.componentRef.setInput('$userSpaceContactID', undefined);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
