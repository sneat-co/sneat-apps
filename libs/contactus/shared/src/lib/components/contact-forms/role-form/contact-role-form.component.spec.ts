import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
	IonCard,
	IonItemDivider,
	IonLabel,
	IonSelect,
	IonSelectOption,
	IonItem,
} from '@ionic/angular/standalone';
import { of } from 'rxjs';

import { ContactRoleFormComponent } from './contact-role-form.component';
import { ContactGroupService } from '@sneat/contactus-services';
import { ErrorLogger } from '@sneat/logging';

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

@Component({
	selector: 'ion-select-option',
	template: '',
	standalone: true,
})
class MockIonSelectOption {
	@Input() value: any;
}

describe('ContactRoleFormComponent', () => {
	let component: ContactRoleFormComponent;
	let fixture: ComponentFixture<MockComponent>;

	@Component({
		selector: 'sneat-mock-component',
		template:
			'<sneat-contact-role-form [contactGroupID]="undefined" [contactRoleID]="undefined"/>',
		imports: [ContactRoleFormComponent, MockIonSelect, MockIonSelectOption],
		standalone: true,
	})
	class MockComponent {}

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MockComponent, MockIonSelect, MockIonSelectOption],
			providers: [
				{
					provide: ContactGroupService,
					useValue: { getContactGroups: vi.fn().mockReturnValue(of([])) },
				},
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
			.overrideComponent(ContactRoleFormComponent, {
				remove: {
					imports: [
						IonCard,
						IonItemDivider,
						IonLabel,
						IonSelect,
						IonSelectOption,
						IonItem,
					],
				},
				add: {
					imports: [MockIonSelect, MockIonSelectOption],
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
