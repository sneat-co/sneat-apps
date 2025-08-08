import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputParametersComponent } from './input-parameters.component';

describe('InputParametersComponent', () => {
	let component: InputParametersComponent;
	let fixture: ComponentFixture<InputParametersComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [InputParametersComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InputParametersComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
