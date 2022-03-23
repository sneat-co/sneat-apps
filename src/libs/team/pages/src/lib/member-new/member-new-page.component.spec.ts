import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemberNewPageComponent } from './member-new-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeamService } from '@sneat/team/services';

describe('MemberNewPage', () => {
	let component: MemberNewPageComponent;
	let fixture: ComponentFixture<MemberNewPageComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [MemberNewPageComponent],
				imports: [
					IonicModule.forRoot(),
					RouterTestingModule,
					HttpClientTestingModule,
					AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				providers: [TeamService, UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(MemberNewPageComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
