import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';

import { EntityFieldDialogComponent } from './entity-field-dialog.component';

describe('EntityFieldDialogComponent', () => {
	let component: EntityFieldDialogComponent;
	let fixture: ComponentFixture<EntityFieldDialogComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [EntityFieldDialogComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: PopoverController,
					useValue: {
						create: vi.fn(),
						dismiss: vi.fn(() => Promise.resolve()),
					},
				},
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
			],
		})
			.overrideComponent(EntityFieldDialogComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(EntityFieldDialogComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
