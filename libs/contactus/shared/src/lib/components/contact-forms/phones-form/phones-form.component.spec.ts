import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, forwardRef, Component } from '@angular/core';
import {
	FormsModule,
	NG_VALUE_ACCESSOR,
	ControlValueAccessor,
} from '@angular/forms';
import { ErrorLogger } from '@sneat/logging';
import {
	IonCard,
	IonItemDivider,
	IonLabel,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
	IonItem,
	IonSelect,
	IonSelectOption,
	IonInput,
} from '@ionic/angular/standalone';

import { PhonesFormComponent } from './phones-form.component';

@Component({
	selector: 'ion-input',
	template: '',
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MockIonInput),
			multi: true,
		},
	],
})
class MockIonInput implements ControlValueAccessor {
	writeValue() {}
	registerOnChange() {}
	registerOnTouched() {}
}

@Component({
	selector: 'ion-select',
	template: '',
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MockIonSelect),
			multi: true,
		},
	],
})
class MockIonSelect implements ControlValueAccessor {
	writeValue() {}
	registerOnChange() {}
	registerOnTouched() {}
}

describe('PhonesFormComponent', () => {
	let component: PhonesFormComponent;
	let fixture: ComponentFixture<PhonesFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [PhonesFormComponent, FormsModule, MockIonInput, MockIonSelect],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: jest.fn(),
						logErrorHandler: jest.fn(() => jest.fn()),
					},
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(PhonesFormComponent, {
				remove: {
					imports: [
						IonCard,
						IonItemDivider,
						IonLabel,
						IonIcon,
						IonGrid,
						IonRow,
						IonCol,
						IonItem,
						IonSelect,
						IonSelectOption,
						IonInput,
					],
				},
				add: {
					imports: [MockIonInput, MockIonSelect, FormsModule],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();
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
