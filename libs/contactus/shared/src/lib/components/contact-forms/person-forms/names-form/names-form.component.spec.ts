import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NamesFormComponent } from './names-form.component';

describe('NamesFormComponent', () => {
	let component: NamesFormComponent;
	let fixture: ComponentFixture<NamesFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [NamesFormComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NamesFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
