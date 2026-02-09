import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular/standalone';
import { SneatApiService } from '@sneat/api';
import { UserRecordService } from '@sneat/auth-core';
import { AnalyticsService, APP_INFO, ErrorLogger } from '@sneat/core';
import { RandomIdService } from '@sneat/random';
import { EmailLoginFormComponent } from './email-login-form.component';

describe('EmailLoginFormComponent', () => {
	let component: EmailLoginFormComponent;
	let fixture: ComponentFixture<EmailLoginFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [EmailLoginFormComponent],
			providers: [
				{
					provide: APP_INFO,
					useValue: { appId: 'test', appTitle: 'Test' },
				},
				{
					provide: AnalyticsService,
					useValue: { logEvent: vi.fn() },
				},
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{ provide: ToastController, useValue: { create: vi.fn() } },
				{ provide: Auth, useValue: {} },
				{
					provide: RandomIdService,
					useValue: { newRandomId: () => 'test-id' },
				},
				{
					provide: SneatApiService,
					useValue: { post: vi.fn(), setApiAuthToken: vi.fn() },
				},
				{
					provide: UserRecordService,
					useValue: { initUserRecord: vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(EmailLoginFormComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
		fixture = TestBed.createComponent(EmailLoginFormComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
