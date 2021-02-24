import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {RetroMyItemsComponent} from './retro-my-items.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';

describe('RetroMyItemsComponent', () => {
	let component: RetroMyItemsComponent;
	let fixture: ComponentFixture<RetroMyItemsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [RetroMyItemsComponent],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			]
		}).compileComponents();

		fixture = TestBed.createComponent(RetroMyItemsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
