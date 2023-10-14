import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetroTimerComponent } from './retro-timer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RetroTimerComponent', () => {
	let component: RetroTimerComponent;
	let fixture: ComponentFixture<RetroTimerComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [RetroTimerComponent],
			imports: [IonicModule.forRoot(), HttpClientTestingModule],
		}).compileComponents();

		fixture = TestBed.createComponent(RetroTimerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
