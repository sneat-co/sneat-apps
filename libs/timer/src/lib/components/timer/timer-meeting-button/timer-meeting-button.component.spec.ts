import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimerMeetingButtonComponent } from './timer-meeting-button.component';

describe('TimerMeetingButtonComponent', () => {
	let component: TimerMeetingButtonComponent;
	let fixture: ComponentFixture<TimerMeetingButtonComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TimerMeetingButtonComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(TimerMeetingButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
