import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { SpaceNavService } from '@sneat/space-services';

import { PetKindAndBreedFormComponent } from './pet-kind-and-breed-form.component';

describe('PetKindAndBreedFormComponent', () => {
	let component: PetKindAndBreedFormComponent;
	let fixture: ComponentFixture<PetKindAndBreedFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [PetKindAndBreedFormComponent],
			providers: [
				{ provide: ClassName, useValue: 'PetKindAndBreedFormComponent' },
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
			.overrideComponent(PetKindAndBreedFormComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PetKindAndBreedFormComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$contact', {
			id: 'test',
			space: { id: 'test-space' },
			dbo: { type: 'animal' },
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
