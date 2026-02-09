import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { EntityPageComponent } from './entity-page.component';
import { EntityService } from '../../../services/unsorted/entity.service';

describe('EntityPage', () => {
	let component: EntityPageComponent;
	let fixture: ComponentFixture<EntityPageComponent>;

	beforeEach(waitForAsync(async () => {
		Object.defineProperty(window, 'history', {
			value: { ...window.history, state: { entity: undefined } },
			writable: true,
			configurable: true,
		});
		await TestBed.configureTestingModule({
			imports: [EntityPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						queryParamMap: of({ get: () => null }),
						paramMap: of({ get: () => null }),
						snapshot: { paramMap: { get: () => null } },
					},
				},
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: EntityService,
					useValue: { getEntity: vi.fn(), getAllEntities: vi.fn() },
				},
				{ provide: HttpClient, useValue: { get: vi.fn(), post: vi.fn() } },
			],
		})
			.overrideComponent(EntityPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(EntityPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
