import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
	IonItemGroup,
	IonItem,
	IonLabel,
	IonButtons,
	IonButton,
	IonIcon,
	IonItemSliding,
	IonItemDivider,
	IonSpinner,
} from '@ionic/angular/standalone';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ContactsByTypeComponent } from './contacts-by-type.component';
import { ContactNavService } from '@sneat/contactus-services';
import { ErrorLogger } from '@sneat/logging';
import { ContactsListItemComponent } from '../contacts-list-item/contacts-list-item.component';

describe('ContactsFamilyComponent', () => {
	let component: ContactsByTypeComponent;
	let fixture: ComponentFixture<MockComponent>;

	@Component({
		selector: 'sneat-mock-component',
		template:
			'<sneat-contacts-by-type [$space]="space" [$contactGroupDefinitions]="[]" [$contacts]="[]" [$filter]="\'\'"/>',
		imports: [ContactsByTypeComponent],
		standalone: true,
	})
	class MockComponent {
		space = { id: 'test-space' };
	}

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MockComponent, NoopAnimationsModule],
			providers: [
				{ provide: ContactNavService, useValue: {} },
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
			.overrideComponent(ContactsByTypeComponent, {
				remove: {
					imports: [
						IonItemGroup,
						IonItem,
						IonLabel,
						IonButtons,
						IonButton,
						IonIcon,
						IonItemSliding,
						IonItemDivider,
						IonSpinner,
						ContactsListItemComponent,
					],
				},
				add: {
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
