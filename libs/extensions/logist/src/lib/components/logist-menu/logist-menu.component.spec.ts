import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogistMenuComponent } from './logist-menu.component';

describe('LogistMenuComponent', () => {
	let component: LogistMenuComponent;
	let fixture: ComponentFixture<LogistMenuComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogistMenuComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LogistMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
