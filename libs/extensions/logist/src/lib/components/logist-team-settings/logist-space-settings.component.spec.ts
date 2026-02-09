import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ContactService } from '@sneat/contactus-services';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { LogistSpaceService } from '../../services';
import { LogistSpaceSettingsComponent } from './logist-space-settings.component';

vi.mock('@angular/fire/firestore');

describe('LogistSpaceSettingsComponent', () => {
	let component: LogistSpaceSettingsComponent;
	let fixture: ComponentFixture<LogistSpaceSettingsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LogistSpaceSettingsComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
					},
				},
				{
					provide: LogistSpaceService,
					useValue: {
						setLogistSpaceSettings: vi.fn(() => of({})),
					},
				},
				{
					provide: ContactService,
					useValue: {
						watchContactById: vi.fn(() => of({})),
					},
				},
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
			.overrideComponent(LogistSpaceSettingsComponent, {
				set: {
					imports: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					template: '',
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(LogistSpaceSettingsComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
