import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SneatAuthStateService } from '@sneat/auth-core';
import { of } from 'rxjs';

import { DatatugMenuComponent } from './datatug-menu.component';
import { DatatugNavContextService } from '../services/nav/datatug-nav-context.service';
import { DatatugNavService } from '../services/nav/datatug-nav.service';
import { DatatugUserService } from '../services/base/datatug-user-service';

describe('DatatugMenuComponent', () => {
	let component: DatatugMenuComponent;
	let fixture: ComponentFixture<DatatugMenuComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [DatatugMenuComponent],
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
					provide: SneatAuthStateService,
					useValue: {
						authState: of({ status: undefined }),
						authStatus: of(undefined),
					},
				},
				{
					provide: DatatugNavContextService,
					useValue: {
						currentProject: of(undefined),
						currentEnv: of(undefined),
						currentStoreId: of(undefined),
						currentFolder: of(undefined),
						currentEnvDbTable: of(undefined),
					},
				},
				{ provide: DatatugNavService, useValue: { goProjPage: vi.fn() } },
				{
					provide: DatatugUserService,
					useValue: {
						datatugUserState: of({ status: undefined, record: null }),
					},
				},
			],
		})
			.overrideComponent(DatatugMenuComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(DatatugMenuComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
