import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpaceMenuComponent } from './space-menu.component';

describe('SpaceMenuComponent', () => {
	let component: SpaceMenuComponent;
	let fixture: ComponentFixture<SpaceMenuComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpaceMenuComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpaceMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
