import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserProfilePageComponent } from './user-profile-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/user-service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserProfilePage', () => {
	let component: UserProfilePageComponent;
	let fixture: ComponentFixture<UserProfilePageComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [UserProfilePageComponent],
				imports: [
					IonicModule.forRoot(),
					RouterTestingModule,
					HttpClientTestingModule,
					AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				providers: [UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(UserProfilePageComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
