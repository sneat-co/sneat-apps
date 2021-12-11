import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetrospectivePageComponent } from './retrospective-page.component';
import { TeamService } from '../../../services/team.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RetrospectivePage', () => {
	let component: RetrospectivePageComponent;
	let fixture: ComponentFixture<RetrospectivePageComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [RetrospectivePageComponent],
				imports: [
					IonicModule.forRoot(),
					HttpClientTestingModule,
					RouterTestingModule,
					AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				providers: [TeamService, UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(RetrospectivePageComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
