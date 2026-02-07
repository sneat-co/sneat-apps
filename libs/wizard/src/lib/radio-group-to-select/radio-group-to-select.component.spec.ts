import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
	IonItem,
	IonSelect,
	IonSelectOption,
	IonRadioGroup,
	IonList,
	IonLabel,
	IonListHeader,
	IonRadio,
} from '@ionic/angular/standalone';

import { RadioGroupToSelectComponent } from './radio-group-to-select.component';

describe('RadioGroupToSelectComponent', () => {
	let component: RadioGroupToSelectComponent;
	let fixture: ComponentFixture<RadioGroupToSelectComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [RadioGroupToSelectComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(RadioGroupToSelectComponent, {
				remove: {
					imports: [
						IonItem,
						IonSelect,
						IonSelectOption,
						IonRadioGroup,
						IonList,
						IonLabel,
						IonListHeader,
						IonRadio,
					],
				},
				add: {
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RadioGroupToSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
