import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { UserAuthAccountsComponent } from './user-auth-accounts.component';

describe('UserAuthAccountsComponent', () => {
	let component: UserAuthAccountsComponent;
	let fixture: ComponentFixture<UserAuthAccountsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [UserAuthAccountsComponent],
			providers: [
				{ provide: ClassName, useValue: 'TestComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: SneatUserService,
					useValue: {
						userState: of({ record: undefined }),
					},
				},
				{
					provide: SneatApiService,
					useValue: { delete: vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(UserAuthAccountsComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
		fixture = TestBed.createComponent(UserAuthAccountsComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
