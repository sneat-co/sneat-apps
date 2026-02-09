import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetroFeedbackStageComponent } from './retro-feedback-stage.component';

describe('RetroFeedbackStageComponent', () => {
	let component: RetroFeedbackStageComponent;
	let fixture: ComponentFixture<RetroFeedbackStageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [RetroFeedbackStageComponent, IonicModule.forRoot()],
		})
			.overrideComponent(RetroFeedbackStageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(RetroFeedbackStageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
