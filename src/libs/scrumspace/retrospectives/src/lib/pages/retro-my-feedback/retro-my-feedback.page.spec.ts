import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetroMyFeedbackPage } from './retro-my-feedback.page';
import { RouterTestingModule } from '@angular/router/testing';

describe('RetroMyFeedbackPage', () => {
	let component: RetroMyFeedbackPage;
	let fixture: ComponentFixture<RetroMyFeedbackPage>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [RetroMyFeedbackPage],
				imports: [IonicModule.forRoot(), RouterTestingModule],
			}).compileComponents();

			fixture = TestBed.createComponent(RetroMyFeedbackPage);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
