import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/logging';

import {
	IonItem,
	IonIcon,
	IonLabel,
	IonBadge,
	IonText,
	IonButtons,
	IonButton,
	IonCheckbox,
	IonTextarea,
	IonItemOptions,
	IonItemOption,
} from '@ionic/angular/standalone';

import { ContactsListItemComponent } from './contacts-list-item.component';
import { SpaceNavService } from '@sneat/space-services';
import { ContactService } from '@sneat/contactus-services';

describe('ContactListItemComponent', () => {
	let component: ContactsListItemComponent;
	let fixture: ComponentFixture<ContactsListItemComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContactsListItemComponent],
			providers: [
				{ provide: SpaceNavService, useValue: {} },
				{ provide: ContactService, useValue: {} },
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
			.overrideComponent(ContactsListItemComponent, {
				remove: {
					imports: [
						IonItem,
						IonIcon,
						IonLabel,
						IonBadge,
						IonText,
						IonButtons,
						IonButton,
						IonCheckbox,
						IonTextarea,
						IonItemOptions,
						IonItemOption,
					],
				},
				add: {
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactsListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
