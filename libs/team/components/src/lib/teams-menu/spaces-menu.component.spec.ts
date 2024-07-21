import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpacesMenuComponent } from './spaces-menu.component';

describe('SpacesMenuComponent', () => {
	let component: SpacesMenuComponent;
	let fixture: ComponentFixture<SpacesMenuComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpacesMenuComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpacesMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
