import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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

import { RelatedAsComponent } from './related-as.component';

describe('ContactListItemComponent', () => {
	let component: ContactsListItemComponent;
	let fixture: ComponentFixture<MockComponent>;

	@Component({
		selector: 'sneat-mock-component',
		template: '<sneat-contacts-list-item [$contact]="contact"/>',
		imports: [ContactsListItemComponent],
		standalone: true,
	})
	class MockComponent {
		contact = { id: 'test-contact' };
	}

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MockComponent],
			providers: [
				{ provide: SpaceNavService, useValue: {} },
				{ provide: ContactService, useValue: {} },
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
