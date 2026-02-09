import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { HappeningService } from '../../services/happening.service';
import { HappeningTitleModalComponent } from './happening-title-modal.component';

describe('HappeningTitleModalComponent', () => {
	let component: HappeningTitleModalComponent;
	let fixture: ComponentFixture<HappeningTitleModalComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [HappeningTitleModalComponent],
			providers: [
				{ provide: ClassName, useValue: 'HappeningTitleModalComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{ provide: ModalController, useValue: { dismiss: vi.fn() } },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(HappeningTitleModalComponent, {
				set: {
					imports: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					template: '',
					providers: [
						{ provide: ClassName, useValue: 'HappeningTitleModalComponent' },
						{ provide: HappeningService, useValue: {} },
					],
				},
			})
			.compileComponents();
		fixture = TestBed.createComponent(HappeningTitleModalComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
