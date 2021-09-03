import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ScrumsComponent} from './scrums.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../services/user-service';
import {RouterTestingModule} from '@angular/router/testing';

describe('ScrumsComponent', () => {
	let component: ScrumsComponent;
	let fixture: ComponentFixture<ScrumsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ScrumsComponent],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [
				UserService,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ScrumsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
