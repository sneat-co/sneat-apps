import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController, PopoverController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/logging';
import { ClassName } from '@sneat/ui';
import { HappeningService } from '../../services/happening.service';

import { HappeningSlotFormComponent } from './happening-slot-form.component';

describe('HappeningSlotFormComponent', () => {
	let component: HappeningSlotFormComponent;
	let fixture: ComponentFixture<HappeningSlotFormComponent>;

	beforeEach(waitForAsync(async () => {
		Object.defineProperty(window, 'history', {
			value: { state: { wd: 'mo' } },
			configurable: true,
		});
		await TestBed.configureTestingModule({
			imports: [HappeningSlotFormComponent],
			providers: [
				{ provide: ModalController, useValue: {} },
				{ provide: PopoverController, useValue: {} },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(HappeningSlotFormComponent, {
				set: {
					providers: [
						{ provide: ClassName, useValue: 'HappeningSlotFormComponent' },
						{ provide: HappeningService, useValue: {} },
					],
				},
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HappeningSlotFormComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$happening', { id: 'test-happening' });
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
