import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthMenuItemComponent } from './auth-menu-item.component';

describe('AuthMenuItemComponent', () => {
	let component: AuthMenuItemComponent;
	let fixture: ComponentFixture<AuthMenuItemComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthMenuItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AuthMenuItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
