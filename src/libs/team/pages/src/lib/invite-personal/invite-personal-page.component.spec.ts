import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvitePersonalPageComponent } from './invite-personal-page.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TeamService } from '@sneat/team/services';

describe('InvitePersonalPage', () => {
	let component: InvitePersonalPageComponent;
	let fixture: ComponentFixture<InvitePersonalPageComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [InvitePersonalPageComponent],
				imports: [
					IonicModule.forRoot(),
					HttpClientTestingModule,
					RouterTestingModule,
					AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				providers: [UserService, TeamService],
			}).compileComponents();

			fixture = TestBed.createComponent(InvitePersonalPageComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
