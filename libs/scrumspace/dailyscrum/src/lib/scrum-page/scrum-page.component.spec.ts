import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrumPageComponent } from './scrum-page.component';
// import { TeamService } from '../../services/team.service';
// import { UserService } from '../../services/user-service';
// import { environment } from '../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ScrumPage', () => {
	let component: ScrumPageComponent;
	let fixture: ComponentFixture<ScrumPageComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ScrumPageComponent],
				imports: [
					IonicModule.forRoot(),
					HttpClientTestingModule,
					RouterTestingModule,
					// AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				// providers: [TeamService, UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(ScrumPageComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
