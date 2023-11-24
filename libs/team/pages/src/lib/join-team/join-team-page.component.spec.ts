import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JoinTeamPageComponent } from './join-team-page.component';
import { RouterTestingModule } from '@angular/router/testing';
// import { environment } from '../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JoinTeamPage', () => {
	let component: JoinTeamPageComponent;
	let fixture: ComponentFixture<JoinTeamPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [JoinTeamPageComponent],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
				// AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			// providers: [TeamService, UserService],
		}).compileComponents();

		fixture = TestBed.createComponent(JoinTeamPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
