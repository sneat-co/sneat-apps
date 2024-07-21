import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogistSpaceMenuItemsComponent } from './logist-space-menu-items.component';

describe('LogistMenuComponent', () => {
	let component: LogistSpaceMenuItemsComponent;
	let fixture: ComponentFixture<LogistSpaceMenuItemsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogistSpaceMenuItemsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LogistSpaceMenuItemsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
