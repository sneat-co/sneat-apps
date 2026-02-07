import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	forwardRef,
	Input,
} from '@angular/core';
import {
	FormsModule,
	NG_VALUE_ACCESSOR,
	ControlValueAccessor,
} from '@angular/forms';
import {
	IonCard,
	IonItemDivider,
	IonLabel,
	IonRadioGroup,
	IonRadio,
	IonListHeader,
	IonButtons,
	IonButton,
	IonIcon,
	IonSpinner,
} from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/logging';

import { GenderFormComponent } from './gender-form.component';

@Component({
	selector: 'ion-radio-group',
	template: '<ng-content></ng-content>',
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MockIonRadioGroup),
			multi: true,
		},
	],
})
class MockIonRadioGroup implements ControlValueAccessor {
	writeValue() {}
	registerOnChange() {}
	registerOnTouched() {}
}

@Component({
	selector: 'ion-radio',
	template: '',
	standalone: true,
})
class MockIonRadio {
	@Input() value: any;
}

@Component({
	selector: 'ion-spinner',
	template: '',
	standalone: true,
})
class MockIonSpinner {}

describe('GenderFormComponent', () => {
	let component: GenderFormComponent;
	let fixture: ComponentFixture<MockComponent>;

	@Component({
		selector: 'sneat-mock-component',
		template: '<sneat-gender-form/>',
		imports: [
			GenderFormComponent,
			FormsModule,
			MockIonRadioGroup,
			MockIonRadio,
			MockIonSpinner,
		],
		standalone: true,
	})
	class MockComponent {}

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MockComponent,
				FormsModule,
				MockIonRadioGroup,
				MockIonRadio,
				MockIonSpinner,
			],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: jest.fn(() => vi.fn()),
					},
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(GenderFormComponent, {
				remove: {
					imports: [
						IonCard,
						IonItemDivider,
						IonLabel,
						IonRadioGroup,
						IonRadio,
						IonListHeader,
						IonButtons,
						IonButton,
						IonIcon,
						IonSpinner,
					],
				},
				add: {
					imports: [
						MockIonRadioGroup,
						MockIonRadio,
						MockIonSpinner,
						FormsModule,
					],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MockComponent);
		component = fixture.debugElement.children[0].componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
