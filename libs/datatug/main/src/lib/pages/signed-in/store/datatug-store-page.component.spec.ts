import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { DatatugStorePageComponent } from './datatug-store-page.component';
import { DatatugStoreService } from '../../../services/repo/datatug-store.service';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';
import { AgentStateService } from '../../../services/repo/agent-state.service';
import { NewProjectService } from '../../../project/new-project/new-project.service';
import { DatatugUserService } from '../../../services/base/datatug-user-service';

describe('StorePageComponent', () => {
	let component: DatatugStorePageComponent;
	let fixture: ComponentFixture<DatatugStorePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [DatatugStorePageComponent],
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
					provide: ActivatedRoute,
					useValue: {
						queryParamMap: of({ get: () => null }),
						paramMap: of({ get: () => null }),
						snapshot: { paramMap: { get: () => null }, params: {} },
					},
				},
				{ provide: DatatugStoreService, useValue: { getProjects: vi.fn() } },
				{
					provide: DatatugNavService,
					useValue: { goProject: vi.fn(), goStore: vi.fn() },
				},
				{
					provide: AgentStateService,
					useValue: { watchAgentInfo: vi.fn(() => of()) },
				},
				{
					provide: NewProjectService,
					useValue: { openNewProjectDialog: vi.fn() },
				},
				{
					provide: DatatugUserService,
					useValue: {
						datatugUserState: of({ status: undefined, record: null }),
					},
				},
			],
		})
			.overrideComponent(DatatugStorePageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(DatatugStorePageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
