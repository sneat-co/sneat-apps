import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { HappeningService } from '../../../services/happening.service';
import { HappeningPriceModalComponent } from './happening-price-modal.component';

describe('HappeningPriceModalComponent', () => {
	let component: HappeningPriceModalComponent;
	let fixture: ComponentFixture<HappeningPriceModalComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [HappeningPriceModalComponent],
			providers: [
				{ provide: ClassName, useValue: 'HappeningPriceFormComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{ provide: ModalController, useValue: { dismiss: vi.fn() } },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(HappeningPriceModalComponent, {
				set: {
					imports: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					template: '',
					providers: [
						{ provide: ClassName, useValue: 'HappeningPriceFormComponent' },
						{ provide: HappeningService, useValue: {} },
					],
				},
			})
			.compileComponents();
		fixture = TestBed.createComponent(HappeningPriceModalComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
