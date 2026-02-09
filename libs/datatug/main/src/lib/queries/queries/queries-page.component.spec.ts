import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { QueriesPageComponent } from './queries-page.component';

describe('SqlQueriesPage', () => {
	let component: QueriesPageComponent;
	let fixture: ComponentFixture<QueriesPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [QueriesPageComponent],
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
					provide: Router,
					useValue: {
						navigate: vi.fn(() => Promise.resolve(true)),
						events: of(),
					},
				},
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
			],
		})
			.overrideComponent(QueriesPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(QueriesPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
