import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { EnvSelectorComponent } from './env-selector.component';
import { DatatugNavContextService } from '../../../../services/nav/datatug-nav-context.service';

describe('EnvSelectorComponent', () => {
	let component: EnvSelectorComponent;
	let fixture: ComponentFixture<EnvSelectorComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [EnvSelectorComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: DatatugNavContextService,
					useValue: {
						currentProject: of(undefined),
						currentEnv: of(undefined),
						setCurrentEnvironment: vi.fn(),
					},
				},
			],
		})
			.overrideComponent(EnvSelectorComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(EnvSelectorComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
