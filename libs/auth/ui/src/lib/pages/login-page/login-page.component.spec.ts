import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';

describe('LoginPage', () => {
	let component: LoginPageComponent;
	let fixture: ComponentFixture<LoginPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [LoginPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LoginPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
