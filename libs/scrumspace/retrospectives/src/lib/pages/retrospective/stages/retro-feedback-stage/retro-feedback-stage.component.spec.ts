import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetroFeedbackStageComponent } from './retro-feedback-stage.component';

describe('RetroFeedbackStageComponent', () => {
	let component: RetroFeedbackStageComponent;
	let fixture: ComponentFixture<RetroFeedbackStageComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [RetroFeedbackStageComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(RetroFeedbackStageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
