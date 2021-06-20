import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {InvitePersonalPage} from './invite-personal.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {UserService} from '../../services/user-service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TeamService} from '../../../../services/src/lib/team.service';

describe('InvitePersonalPage', () => {
	let component: InvitePersonalPage;
	let fixture: ComponentFixture<InvitePersonalPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [InvitePersonalPage],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [
				UserService,
				TeamService,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(InvitePersonalPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
