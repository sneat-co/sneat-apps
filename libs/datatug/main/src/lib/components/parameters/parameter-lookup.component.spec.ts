import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';

import { ParameterLookupComponent } from './parameter-lookup.component';
import { DatatugStoreService } from '../../services/repo/datatug-store.service';

describe('ParameterLookupComponent', () => {
	let component: ParameterLookupComponent;
	let fixture: ComponentFixture<ParameterLookupComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ParameterLookupComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: DatatugStoreService, useValue: {} },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: ModalController,
					useValue: { dismiss: vi.fn(() => Promise.resolve()) },
				},
			],
		})
			.overrideComponent(ParameterLookupComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(ParameterLookupComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
