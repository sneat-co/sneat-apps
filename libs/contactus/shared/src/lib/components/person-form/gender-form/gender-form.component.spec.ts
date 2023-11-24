import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenderFormComponent } from './gender-form.component';

describe('GenderFormComponent', () => {
	let component: GenderFormComponent;
	let fixture: ComponentFixture<GenderFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [GenderFormComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GenderFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
