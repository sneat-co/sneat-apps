import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
	let component: BoardComponent;
	let fixture: ComponentFixture<BoardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [BoardComponent],
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
					provide: ModalController,
					useValue: { create: vi.fn(), dismiss: vi.fn() },
				},
			],
		})
			.overrideComponent(BoardComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(BoardComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
