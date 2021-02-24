import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {RetroTimerComponent} from './retro-timer.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';

describe('RetroTimerComponent', () => {
	let component: RetroTimerComponent;
	let fixture: ComponentFixture<RetroTimerComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [RetroTimerComponent],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(RetroTimerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
