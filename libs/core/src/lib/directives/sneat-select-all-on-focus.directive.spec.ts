import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SneatSelectAllOnFocusDirective } from './sneat-select-all-on-focus.directive';

@Component({
	template: '<input sneatSelectAllOnFocus />',
	imports: [SneatSelectAllOnFocusDirective],
})
class TestHostComponent {}

describe('SneatSelectAllOnFocusDirective', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestHostComponent],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(TestHostComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});
});
