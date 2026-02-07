import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, forwardRef } from '@angular/core';
import {
	ReactiveFormsModule,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ControlValueAccessor,
} from '@angular/forms';
import { ErrorLogger } from '@sneat/logging';

import {
	IonCard,
	IonItemDivider,
	IonItem,
	IonLabel,
	IonInput,
} from '@ionic/angular/standalone';

import { NamesFormComponent } from './names-form.component';

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

describe('NamesFormComponent', () => {
	let component: NamesFormComponent;
	let fixture: ComponentFixture<MockComponent>;

	@Component({
		selector: 'sneat-mock-component',
		template: '<sneat-names-form/>',
		imports: [NamesFormComponent, ReactiveFormsModule, FormsModule],
		standalone: true,
	})
	class MockComponent {}

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MockComponent, ReactiveFormsModule, FormsModule, MockIonInput],
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
			.overrideComponent(NamesFormComponent, {
				remove: {
					imports: [
						IonCard,
						IonItemDivider,
						IonItem,
						IonLabel,
						IonInput,
						IonButton,
					],
				},
				add: {
					imports: [MockIonInput],
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
