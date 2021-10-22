import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetrospectivePage } from './retrospective.page';
import { TeamService } from '../../../services/team.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RetrospectivePage', () => {
	let component: RetrospectivePage;
	let fixture: ComponentFixture<RetrospectivePage>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [RetrospectivePage],
				imports: [
					IonicModule.forRoot(),
					HttpClientTestingModule,
					RouterTestingModule,
					AngularFireModule.initializeApp(environment.firebaseConfig),
				],
				providers: [TeamService, UserService],
			}).compileComponents();

			fixture = TestBed.createComponent(RetrospectivePage);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
