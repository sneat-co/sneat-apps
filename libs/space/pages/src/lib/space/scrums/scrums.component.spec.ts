import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';

import { ScrumsComponent } from './scrums.component';

describe('ScrumsComponent', () => {
	let component: ScrumsComponent;
	let fixture: ComponentFixture<ScrumsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ScrumsComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
					},
				},
				{ provide: NavController, useValue: {} },
				{
					provide: SpaceNavService,
					useValue: {
						navigateForwardToSpacePage: vi.fn(),
						navigateToScrum: vi.fn(),
						navigateToScrums: vi.fn(),
					},
				},
			],
		})
			.overrideComponent(ScrumsComponent, {
				set: {
					imports: [],
					providers: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(ScrumsComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
