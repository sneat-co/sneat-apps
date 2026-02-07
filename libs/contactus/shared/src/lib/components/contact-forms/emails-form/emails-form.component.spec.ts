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

import { EmailsFormComponent } from './emails-form.component';

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

describe('EmailsFormComponent', () => {
	let component: EmailsFormComponent;
	let fixture: ComponentFixture<EmailsFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [EmailsFormComponent, FormsModule, MockIonInput, MockIonSelect],
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
			.overrideComponent(EmailsFormComponent, {
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
		fixture = TestBed.createComponent(EmailsFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
