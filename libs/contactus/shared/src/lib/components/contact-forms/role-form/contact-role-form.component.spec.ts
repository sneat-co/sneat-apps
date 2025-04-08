import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactRoleFormComponent } from './contact-role-form.component';

describe('ContactTypeFormComponent', () => {
	let component: ContactRoleFormComponent;
	let fixture: ComponentFixture<ContactRoleFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [ContactRoleFormComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactRoleFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
