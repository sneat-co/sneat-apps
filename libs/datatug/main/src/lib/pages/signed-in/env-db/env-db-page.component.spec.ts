import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { EnvDbPageComponent } from './env-db-page.component';
import { ProjectService } from '../../../services/project/project.service';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';

describe('EnvDbPage', () => {
	let component: EnvDbPageComponent;
	let fixture: ComponentFixture<EnvDbPageComponent>;

	beforeEach(waitForAsync(async () => {
		Object.defineProperty(window, 'history', {
			value: { ...window.history, state: { db: undefined } },
			writable: true,
			configurable: true,
		});
		await TestBed.configureTestingModule({
			imports: [EnvDbPageComponent],
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
					provide: ProjectService,
					useValue: { watchProjectSummary: vi.fn(), getFull: vi.fn() },
				},
				{ provide: DatatugNavService, useValue: { goTable: vi.fn() } },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParamMap: of({ get: () => null }),
						paramMap: of({ get: () => null }),
						snapshot: { paramMap: { get: () => null }, params: {} },
					},
				},
			],
		})
			.overrideComponent(EnvDbPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(EnvDbPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
