import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/logging';

import { TimerMemberButtonComponent } from './timer-member-button.component';

describe('TimerMemberButtonComponent', () => {
	let component: TimerMemberButtonComponent;
	let fixture: ComponentFixture<TimerMemberButtonComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [TimerMemberButtonComponent],
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
			.overrideComponent(TimerMemberButtonComponent, {
				remove: { imports: [IonButton] },
				add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(TimerMemberButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
