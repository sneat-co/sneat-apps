import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { ProjectMenuTopComponent } from './project-menu-top.component';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';
import { DatatugUserService } from '../../../services/base/datatug-user-service';

describe('ProjectContextMenuComponent', () => {
	let component: ProjectMenuTopComponent;
	let fixture: ComponentFixture<ProjectMenuTopComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ProjectMenuTopComponent],
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
						currentFolder: of(undefined),
						setCurrentEnvironment: vi.fn(),
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
			.overrideComponent(ProjectMenuTopComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(ProjectMenuTopComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
