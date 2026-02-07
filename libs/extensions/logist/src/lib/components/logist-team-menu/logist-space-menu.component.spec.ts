import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogistSpaceMenuComponent } from './logist-space-menu.component';

describe('LogistMenuComponent', () => {
	let component: LogistSpaceMenuComponent;
	let fixture: ComponentFixture<LogistSpaceMenuComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LogistSpaceMenuComponent]}).compileComponents();

		fixture = TestBed.createComponent(LogistSpaceMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
