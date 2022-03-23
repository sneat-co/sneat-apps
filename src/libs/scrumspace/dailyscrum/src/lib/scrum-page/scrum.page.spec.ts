import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrumPage } from './scrum.page';
import { TeamService } from '../../services/team.service';
import { UserService } from '../../services/user-service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ScrumPage', () => {
	let component: ScrumPage;
	let fixture: ComponentFixture<ScrumPage>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ScrumPage],
				imports: [
					IonicModule.forRoot(),
					HttpClientTestingModule,
					RouterTestingModule,
					AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				providers: [TeamService, UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(ScrumPage);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
