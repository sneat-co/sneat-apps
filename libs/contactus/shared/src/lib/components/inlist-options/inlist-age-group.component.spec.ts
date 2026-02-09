import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { SpaceNavService } from '@sneat/space-services';
import { ContactService } from '@sneat/contactus-services';

import { InlistAgeGroupComponent } from './inlist-age-group.component';

describe('InlistAgeGroupComponent', () => {
	let component: InlistAgeGroupComponent;
	let fixture: ComponentFixture<InlistAgeGroupComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [InlistAgeGroupComponent],
			providers: [
				{ provide: ClassName, useValue: 'InlistAgeGroupComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: SpaceNavService, useValue: {} },
				{ provide: ContactService, useValue: { updateContact: vi.fn() } },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(InlistAgeGroupComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InlistAgeGroupComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
