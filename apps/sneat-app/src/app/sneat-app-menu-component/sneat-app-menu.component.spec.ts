import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SneatAppMenuComponentComponent } from './sneat-app-menu-component.component';

describe('SneatAppMenuComponentComponent', () => {
	let component: SneatAppMenuComponentComponent;
	let fixture: ComponentFixture<SneatAppMenuComponentComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [SneatAppMenuComponentComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SneatAppMenuComponentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
