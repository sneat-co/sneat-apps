import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ErrorLogger } from '@sneat/core';
import { SneatUserService } from '@sneat/auth-core';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { UserCountryComponent } from './user-country.component';

describe('UserCountryComponent', () => {
	let component: UserCountryComponent;
	let fixture: ComponentFixture<UserCountryComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [UserCountryComponent],
			providers: [
				{ provide: ClassName, useValue: 'TestComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: HttpClient,
					useValue: { get: vi.fn(() => of('US')) },
				},
				{
					provide: SneatUserService,
					useValue: {
						userState: of({ record: undefined }),
						user$: of({}),
						userChanged: of(undefined),
					},
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(UserCountryComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
		fixture = TestBed.createComponent(UserCountryComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
