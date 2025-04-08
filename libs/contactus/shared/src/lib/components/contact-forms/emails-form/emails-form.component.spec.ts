import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailsFormComponent } from './emails-form.component';

describe('EmailsFormComponent', () => {
	let component: EmailsFormComponent;
	let fixture: ComponentFixture<EmailsFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [EmailsFormComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmailsFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
