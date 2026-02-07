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

describe('GenderFormComponent', () => {
	let component: GenderFormComponent;
	let fixture: ComponentFixture<MockComponent>;

	@Component({
		selector: 'sneat-mock-component',
		template: '<sneat-gender-form/>',
		imports: [GenderFormComponent, FormsModule],
		standalone: true,
	})
	class MockComponent {}

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MockComponent, FormsModule],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
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
