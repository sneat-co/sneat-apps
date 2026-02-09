import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { provideLogistMocks } from '../../testing/test-utils';
import { LogistSpaceService } from '../../services';
import { LogistSpaceSettingsPageComponent } from './logist-space-settings-page.component';

vi.mock('@angular/fire/firestore');

describe('LogistSpaceSettingsPageComponent', () => {
	let component: LogistSpaceSettingsPageComponent;
	let fixture: ComponentFixture<LogistSpaceSettingsPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LogistSpaceSettingsPageComponent],
			providers: [
				...provideLogistMocks(),
				LogistSpaceService,
				{
					provide: SneatApiService,
					useValue: {
						post: vi.fn(() => of({})),
						get: vi.fn(() => of({})),
					},
				},
				{
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(LogistSpaceSettingsPageComponent, {
				set: {
					imports: [],
					providers: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(LogistSpaceSettingsPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
