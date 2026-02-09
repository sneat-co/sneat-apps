import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '../../components';
import { OverlayController } from '../selector-base.component';
import { MultiSelectorComponent } from './multi-selector.component';

describe('MultiSelectorComponent', () => {
	let component: MultiSelectorComponent;
	let fixture: ComponentFixture<MultiSelectorComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MultiSelectorComponent],
			providers: [
				{ provide: ClassName, useValue: 'TestComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: OverlayController,
					useValue: { dismiss: vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(MultiSelectorComponent, {
				set: {
					imports: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();
		fixture = TestBed.createComponent(MultiSelectorComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
