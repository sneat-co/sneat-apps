import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimerMemberButtonComponent } from './timer-member-button.component';

describe('TimerMemberButtonComponent', () => {
	let component: TimerMemberButtonComponent;
	let fixture: ComponentFixture<TimerMemberButtonComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [TimerMemberButtonComponent],
				imports: [IonicModule.forRoot()],
			}).compileComponents();

			fixture = TestBed.createComponent(TimerMemberButtonComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
