import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MemberNewPage} from './member-new.page';
import {RouterTestingModule} from '@angular/router/testing';
import {TeamService} from '../../services/team.service';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {UserService} from '../../services/user-service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MemberNewPage', () => {
	let component: MemberNewPage;
	let fixture: ComponentFixture<MemberNewPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [MemberNewPage],
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

		fixture = TestBed.createComponent(MemberNewPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
