import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {JoinTeamPage} from './join-team.page';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {TeamService} from '../../services/team.service';
import {UserService} from '../../services/user-service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('JoinTeamPage', () => {
	let component: JoinTeamPage;
	let fixture: ComponentFixture<JoinTeamPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [JoinTeamPage],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [
				TeamService,
				UserService,
			]
		}).compileComponents();

		fixture = TestBed.createComponent(JoinTeamPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
