import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ScrumsHistoryPage} from './scrums-history.page';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {TeamService} from '../../services/team.service';
import {UserService} from '../../services/user-service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ScrumsHistoryPage', () => {
	let component: ScrumsHistoryPage;
	let fixture: ComponentFixture<ScrumsHistoryPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ScrumsHistoryPage],
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
		fixture = TestBed.createComponent(ScrumsHistoryPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
