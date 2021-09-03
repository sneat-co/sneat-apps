import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TeamPage} from './team.page';
import {RouterTestingModule} from '@angular/router/testing';
import {TeamService} from '../../../../services/src/lib/team.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../../../environments/environment';
import {UserService} from '../../services/user-service';

describe('TeamPage', () => {
	let component: TeamPage;
	let fixture: ComponentFixture<TeamPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TeamPage],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [
				TeamService,
				UserService,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(TeamPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
