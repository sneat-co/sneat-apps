import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MemberPage} from './member.page';
import {RouterTestingModule} from '@angular/router/testing';
import {UserService} from '../../services/user-service';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TeamService} from '../../services/team.service';

describe('MemberPage', () => {
	let component: MemberPage;
	let fixture: ComponentFixture<MemberPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [MemberPage],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [
				UserService,
				TeamService,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MemberPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
