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

describe('PhonesFormComponent', () => {
	let component: PhonesFormComponent;
	let fixture: ComponentFixture<PhonesFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [PhonesFormComponent, FormsModule],
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
		fixture = TestBed.createComponent(PhonesFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
