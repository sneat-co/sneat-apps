import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogistSpacePageComponent } from './logist-space-page.component';

describe('LogistMainPageComponent', () => {
	let component: LogistSpacePageComponent;
	let fixture: ComponentFixture<LogistSpacePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LogistSpacePageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LogistSpacePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
