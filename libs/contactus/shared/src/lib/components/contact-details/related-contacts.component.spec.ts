import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { SpaceNavService } from '@sneat/space-services';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { of } from 'rxjs';

import { RelatedContactsComponent } from './related-contacts.component';

describe('RelatedContactsComponent', () => {
	let component: RelatedContactsComponent;
	let fixture: ComponentFixture<RelatedContactsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [RelatedContactsComponent, NoopAnimationsModule],
			providers: [
				{ provide: ClassName, useValue: 'RelatedContactsComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: SpaceNavService, useValue: {} },
				{
					provide: ContactusSpaceService,
					useValue: { watchContactBriefs: vi.fn(() => of([])) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(RelatedContactsComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RelatedContactsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$relatedTo', undefined);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
