import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AssetService } from '../../services';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { NavController } from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';

import { AssetAddDwellingComponent } from './asset-add-dwelling.component';

describe('AssetAddDwellingPage', () => {
	let component: AssetAddDwellingComponent;
	let fixture: ComponentFixture<AssetAddDwellingComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [AssetAddDwellingComponent],
			providers: [
				{ provide: AssetService, useValue: {} },
				{
					provide: SpaceComponentBaseParams,
					useValue: {
						userService: { userState: of({}) },
						spaceNavService: {},
						errorLogger: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
					},
				},
				{ provide: NavController, useValue: {} },
				{ provide: SneatUserService, useValue: { userState: of({}) } },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetAddDwellingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
