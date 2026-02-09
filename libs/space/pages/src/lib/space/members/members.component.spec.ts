import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService, SpaceService } from '@sneat/space-services';

import { MembersComponent } from './members.component';

describe('MembersComponent', () => {
	let component: MembersComponent;
	let fixture: ComponentFixture<MembersComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MembersComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
					},
				},
				{ provide: SpaceService, useValue: {} },
				{ provide: NavController, useValue: {} },
				{
					provide: SpaceNavService,
					useValue: { navigateForwardToSpacePage: vi.fn() },
				},
			],
		})
			.overrideComponent(MembersComponent, {
				set: {
					imports: [],
					providers: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(MembersComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
