import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { BoardPageComponent } from './board-page.component';
import { DatatugBoardService } from '../../../core/datatug-board.service';
import { ParameterLookupService } from '../../../../components/parameters/parameter-lookup.service';
import { DatatugNavContextService } from '../../../../services/nav/datatug-nav-context.service';
import { QueryParamsService } from '../../../../core/services/QueryParamsService';

describe('BoardPage', () => {
	let component: BoardPageComponent;
	let fixture: ComponentFixture<BoardPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [BoardPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: DatatugBoardService, useValue: { getBoard: vi.fn() } },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParamMap: of({ get: () => null }),
						paramMap: of({ get: () => null }),
						snapshot: { paramMap: { get: () => null } },
					},
				},
				{
					provide: ParameterLookupService,
					useValue: { lookupParameterValue: vi.fn() },
				},
				{
					provide: DatatugNavContextService,
					useValue: {
						currentProject: of(undefined),
						currentEnv: of(undefined),
						setCurrentEnvironment: vi.fn(),
					},
				},
				{
					provide: QueryParamsService,
					useValue: { setQueryParameter: vi.fn() },
				},
			],
		})
			.overrideComponent(BoardPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(BoardPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
