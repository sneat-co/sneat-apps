import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogistSpaceMenuItemsComponent } from './logist-space-menu-items.component';

describe('LogistMenuComponent', () => {
	let component: LogistSpaceMenuItemsComponent;
	let fixture: ComponentFixture<LogistSpaceMenuItemsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LogistSpaceMenuItemsComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(LogistSpaceMenuItemsComponent, {
				set: { imports: [], providers: [] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(LogistSpaceMenuItemsComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
