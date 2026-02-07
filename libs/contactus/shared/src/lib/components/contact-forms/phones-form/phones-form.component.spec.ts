import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhonesFormComponent } from './phones-form.component';

describe('PhonesFormComponent', () => {
	let component: PhonesFormComponent;
	let fixture: ComponentFixture<PhonesFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [PhonesFormComponent]}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PhonesFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
