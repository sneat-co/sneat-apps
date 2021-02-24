import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {UserProfilePage} from './user-profile.page';
import {RouterTestingModule} from '@angular/router/testing';
import {UserService} from '../../services/user-service';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('UserProfilePage', () => {
	let component: UserProfilePage;
	let fixture: ComponentFixture<UserProfilePage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UserProfilePage],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [
				UserService,
			]
		}).compileComponents();

		fixture = TestBed.createComponent(UserProfilePage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
