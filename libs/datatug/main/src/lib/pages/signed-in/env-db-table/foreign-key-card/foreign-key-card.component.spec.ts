import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';

import { ForeignKeyCardComponent } from './foreign-key-card.component';
import { ProjectService } from '../../../../services/project/project.service';
import { DatatugNavService } from '../../../../services/nav/datatug-nav.service';
import { AgentService } from '../../../../services/repo/agent.service';

describe('ForeignKeyCardComponent', () => {
	let component: ForeignKeyCardComponent;
	let fixture: ComponentFixture<ForeignKeyCardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ForeignKeyCardComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: ProjectService, useValue: { getFull: vi.fn() } },
				{ provide: DatatugNavService, useValue: { goTable: vi.fn() } },
				{ provide: AgentService, useValue: { select: vi.fn() } },
			],
		})
			.overrideComponent(ForeignKeyCardComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(ForeignKeyCardComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
