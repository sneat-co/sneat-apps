import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';

import { SqlQueryWidgetComponent } from './sql-query-widget.component';
import { BoardCardTabService } from '../../board-card/board-card.component';
import { AgentService } from '../../../../../services/repo/agent.service';

describe('SqlQueryWidgetComponent', () => {
	let component: SqlQueryWidgetComponent;
	let fixture: ComponentFixture<SqlQueryWidgetComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [SqlQueryWidgetComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				BoardCardTabService,
				{ provide: AgentService, useValue: { select: vi.fn() } },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
			],
		})
			.overrideComponent(SqlQueryWidgetComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(SqlQueryWidgetComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
