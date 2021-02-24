import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TeamsCardComponent} from './teams-card.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../services/user-service';
import {TeamService} from '../../../services/team.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TeamsCardComponent', () => {
	let component: TeamsCardComponent;
	let fixture: ComponentFixture<TeamsCardComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TeamsCardComponent],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [
				TeamService,
				UserService,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(TeamsCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
