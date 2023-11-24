import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetroMyFeedbackPageComponent } from './retro-my-feedback.page';
import { RouterTestingModule } from '@angular/router/testing';

describe('RetroMyFeedbackPage', () => {
	let component: RetroMyFeedbackPageComponent;
	let fixture: ComponentFixture<RetroMyFeedbackPageComponent>;

	beforeEach(waitForAsync(async () => {
		TestBed.configureTestingModule({
			declarations: [RetroMyFeedbackPageComponent],
			imports: [IonicModule.forRoot(), RouterTestingModule],
		}).compileComponents();

		fixture = TestBed.createComponent(RetroMyFeedbackPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
