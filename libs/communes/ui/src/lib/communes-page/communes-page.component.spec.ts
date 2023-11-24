import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommunesPageComponent } from './communes-page.component';

describe('CommunesPageComponent', () => {
	let component: CommunesPageComponent;
	let fixture: ComponentFixture<CommunesPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [CommunesPageComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommunesPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
