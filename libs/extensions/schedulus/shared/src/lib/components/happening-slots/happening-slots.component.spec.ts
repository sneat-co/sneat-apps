import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ModalController } from '@ionic/angular/standalone';
import { HappeningService } from '../../services/happening.service';
import { HappeningSlotModalService } from '../happening-slot-form/happening-slot-modal.service';

import { HappeningSlotsComponent } from './happening-slots.component';

describe('RegularSlotsComponent', () => {
	let component: HappeningSlotsComponent;
	let fixture: ComponentFixture<HappeningSlotsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [HappeningSlotsComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{ provide: HappeningService, useValue: {} },
				{ provide: HappeningSlotModalService, useValue: {} },
				{ provide: ModalController, useValue: {} },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HappeningSlotsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('happening', {
			id: 'test-happening',
			brief: {},
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
