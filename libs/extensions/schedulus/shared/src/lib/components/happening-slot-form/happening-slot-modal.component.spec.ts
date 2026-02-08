import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { HappeningService } from '../../services/happening.service';
import { HappeningSlotFormComponent } from './happening-slot-form.component';
import { ClassName } from '@sneat/ui';

import { HappeningSlotModalComponent } from './happening-slot-modal.component';

describe('SingleSlotFormComponent', () => {
	let component: HappeningSlotModalComponent;
	let fixture: ComponentFixture<HappeningSlotModalComponent>;

	beforeEach(waitForAsync(async () => {
		Object.defineProperty(window, 'history', {
			value: { state: { wd: 'mo' } },
			configurable: true,
		});
		await TestBed.configureTestingModule({
			imports: [HappeningSlotModalComponent],
			providers: [
				{ provide: ModalController, useValue: {} },
				{ provide: ClassName, useValue: 'HappeningSlotModalComponent' },
			],
		})
			.overrideComponent(HappeningSlotFormComponent, {
				set: { providers: [{ provide: HappeningService, useValue: {} }] },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HappeningSlotModalComponent);
		component = fixture.componentInstance;
		component.space = { id: 'test-space' };
		component.happening = { id: 'test-happening', space: { id: 'test-space' } };
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
