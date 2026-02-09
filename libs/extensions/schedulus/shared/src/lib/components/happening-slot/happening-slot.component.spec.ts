import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HappeningSlotModalService } from '../happening-slot-form/happening-slot-modal.service';
import { HappeningSlotComponent } from './happening-slot.component';

describe('HappeningSlotComponent', () => {
	let component: HappeningSlotComponent;
	let fixture: ComponentFixture<HappeningSlotComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [HappeningSlotComponent],
			providers: [{ provide: HappeningSlotModalService, useValue: {} }],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(HappeningSlotComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
			})
			.compileComponents();
		fixture = TestBed.createComponent(HappeningSlotComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
